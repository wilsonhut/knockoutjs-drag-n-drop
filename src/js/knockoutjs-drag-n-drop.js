(function($, ko) {
    var _dragged, _hasBeenDropped, _draggedIndex;
    ko.bindingHandlers.drag = {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
            var dragElement = $(element);
            var dragOptions = {
                helper: function() {
                    return dragElement.clone().addClass("ui-dragon");
                },
                revert: true,
                revertDuration: 0,
                start: function() {
                    _hasBeenDropped = false;
                    _dragged = ko.utils.unwrapObservable(valueAccessor().value);
                    if ($.isFunction(valueAccessor().value)) {
                        valueAccessor().value(undefined);
                        dragElement.draggable("option", "revertDuration", 500);
                    } else if (valueAccessor().array) {
                        _draggedIndex = valueAccessor().array.indexOf(_dragged);
                        valueAccessor().array.splice(_draggedIndex, 1);
                    }
                },
                stop: function(e, ui) {
                    if (!_hasBeenDropped) {
                        if ($.isFunction(valueAccessor().value)) {
                            valueAccessor().value(_dragged);
                        } else if (valueAccessor().array) {
                            valueAccessor().array.splice(_draggedIndex, 0, _dragged);
                        }
                    }
                },
                cursor: 'default'
            };
            dragElement.draggable(dragOptions).disableSelection();
        },
        update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
            var dragElement = $(element);
            var disabled = !! ko.utils.unwrapObservable(valueAccessor().disabled);
            dragElement.draggable("option", "disabled", disabled);
        }
    };

    ko.bindingHandlers.drop = {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
            var dropElement = $(element);
            var dropOptions = {
                tolerance: 'pointer',
                drop: function(event, ui) {
                    _hasBeenDropped = true;
                    valueAccessor().value(_dragged);
                    ui.draggable.draggable("option", "revertDuration", 0);
                }
            };
            dropElement.droppable(dropOptions);
        },
        update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
            var dropElement = $(element);
            var disabled = !! ko.utils.unwrapObservable(valueAccessor().disabled);
            dropElement.droppable("option", "accept", disabled ? ".nothing" : "*");
        }
    };
})(jQuery, ko);