/**
 * Created by greg on 21.04.15.
 */
(function ($) {
    var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    var removeFirstSpace = /^[ \t]*/gm;
    var removeDuplicateSpace = /[ \t]{2,}/gm;
    var removeBlankRows = /^\n{3,}/gm;

    function TodoListUtilService() {
        return {
            formatText: formatText,
            getDate: getDate,
            switchValueTask: switchValueTask
        };
        function formatText(str) {
            return str.replace(removeFirstSpace, '')
                .trim()
                .replace(removeDuplicateSpace, ' ')
                .replace(removeBlankRows, '\n')
                .replace(/\n/gm, "<br />\n");
        }

        function getDate(date) {
            return date.getDate() + ' ' +
                monthNames[date.getMonth()] + ' ' +
                date.getFullYear() + ' | ' +
                date.toLocaleTimeString();
        }

        function switchValueTask(from, to) {
            var str = from.val() === '' ?
                from.text() :
                util.formatText(from.val());
            //Use switch where value task from hover to static task
            if (from.val() === '') {
                to.val(str);

                var height = from.height();
                to.height(height);
            } else {
                //Use switch where value task for save edit task
                to.html(str);
                //
                from.val(to.text());

                var height = to.height();
                from.height(height);
            }
        }
    }

    var defaults = {
        btnAddText: 'Add',
        messageUserText: 'You Todo - list is empty. Please add task.',

        inputId: 'input',
        btnAddId: 'btn-add',
        todoListId: 'todo-list',
        dateAddingTask: 'date',
        taskId: 'task',
        textAreaEditTaskId: 'edit-task',
        btnDoneTaskId: 'btn-done',
        btnRemoveTaskId: 'btn-remove',
        btnSaveEditTaskId: 'btn-edit',

        inputClass: 'input',
        btnAddClass: 'btn-add',
        inputGroupClass: 'input-group',
        inputGroupBtnClass: 'input-group-btn',
        todoListClass: 'todo-list',
        liTodoClass: 'li-todo',
        btnDoneTaskClass: 'btn-done',
        btnRemoveTaskClass: 'btn-remove',
        btnEditTaskClass: 'btn-edit',
        messageUserClass: 'text-center'
    };

    function TodoList(element, options) {
        this.config = $.extend({}, defaults, options);
        this.element = element;
        this.init();
        this.bindEvents();
        this.showMessage();
    }

    TodoList.prototype.init = function () {

        this.$inputGroup = $('<div/>', {class: this.config.inputGroupClass}).appendTo(this.element);

        this.$input = $('<input/>', {
            id: this.config.inputId,
            class: this.config.inputClass
        }).focus().appendTo(this.$inputGroup);

        this.$inputGroupBtn = $('<span/>', {
            class: this.config.inputGroupBtnClass
        }).appendTo(this.$inputGroup);

        this.$btnAdd = $('<button/>', {
            text: this.config.btnAddText,
            id: this.config.btnAddId,
            class: this.config.btnAddClass
        }).prop('disabled', true).appendTo(this.$inputGroupBtn);

        this.$messageUser = $('<h2/>', {
            text: this.config.messageUserText,
            class: this.config.messageUserClass
        }).hide().appendTo(this.element);

        this.$todoList = $('<ul/>', {
            id: this.config.todoListId,
            class: this.config.todoListClass
        }).appendTo(this.element);

        this.$li = function () {
            return $('<li/>', {
                class: this.config.liTodoClass
            });
        };

        this.$task = function (str) {
            return $('<div/>', {id: this.config.taskId}).html(TodoListUtilService().formatText(str));
        };

        this.$textAreaEditTask = function () {
            return $('<textarea/>', {
                id: this.config.textAreaEditTaskId,
                rows: '1'
            });
        };

        this.$buttonDone = function () {
            return $('<input/>', {
                type: 'checkbox',
                id: this.config.btnDoneTaskId,
                class: this.config.btnDoneTaskClass
            });
        };

        this.$buttonEdit = function () {
            return $('<button/>', {
                id: this.config.btnSaveEditTaskId,
                class: this.config.btnEditTaskClass
            }).addClass(this.config.btnEditTaskClass)
                .append($(document.createElement('span'))
                    .addClass('glyphicon glyphicon-edit')
                    .attr('aria-hidden', true));
        };

        this.$buttonRemove = function () {
            return $('<span/>', {
                id: this.config.btnRemoveTaskId,
                class: this.config.btnRemoveTaskClass
            });
        };

        this.$dateAddingTask = function () {
            return $('<span/>', {
                id: this.config.dateAddingTask,
                text: TodoListUtilService().getDate(new Date)
            });
        };
    };

    TodoList.prototype.bindEvents = function () {
        this.$btnAdd.on('click', this.createTask.bind(this.$input.val()));
        this.$input.keyup(this.inputKeyUp.bind(this));
        this.$todoList.delegate('#' + this.config.textAreaEditTaskId, 'keyup', this.updateKeyUp.bind(this));
        this.$todoList.delegate('#' + this.config.btnDoneTaskId, 'click', this.done.bind(this));
        this.$todoList.delegate('#' + this.config.btnSaveEditTaskId, 'click', this.update.bind(this));
        this.$todoList.delegate('#' + this.config.btnRemoveTaskId, 'click', this.destroy.bind(this));
        this.$todoList.delegate('li', 'mouseenter mouseleave', this.toggle.bind(this));
    };

    TodoList.prototype.createTask = function (str) {
        $(this.$li()).prependTo(this.$todoList).append(
            $(this.$textAreaEditTask()).hide(),
            $(this.$task(str)),
            $(this.$buttonDone()),
            $(this.$buttonEdit()),
            $(this.$buttonRemove()),
            $(this.$dateAddingTask())
        );

        autosize($('#' + this.config.textAreaEditTaskId));
        this.$input.val('');
        this.showMessage();
    };

    TodoList.prototype.createDoneTask = function (str) {
        $(this.$li()).css({'color': '#999999'}).appendTo(this.$todoList).append(
            $(this.$task(str)).css({'text-decoration': 'line-through'}),
            $(this.$buttonDone()).prop('checked', true),
            $(this.$buttonRemove())
        );
        this.$input.focus();
    };

    TodoList.prototype.updateKeyUp = function () {
        var $li = $(event.target).closest('li');
        var $editTask = $li.find('#' + this.config.textAreaEditTaskId);
        var $btnSaveEditTask = $li.find('#' + this.config.btnSaveEditTaskId);

        var str = $li.find('#' + this.config.taskId).text();
        var editStr = $editTask.val().trim();
        // disabled edit button
        $btnSaveEditTask.prop('disabled', true);

        if (editStr === '') {
            $btnSaveEditTask.prop('disabled', true);
            return;
        }

        if (str != editStr) {
            $btnSaveEditTask.prop('disabled', false);
        }
    };

    TodoList.prototype.inputKeyUp = function (e) {
        var enterBtnKeyCode = 13;
        var currentKeyCode = e.keyCode;

        if (!$(event.target).val().trim()) {
            this.$btnAdd.prop('disabled', true);
        } else if (currentKeyCode === enterBtnKeyCode) {
            this.createTask($(event.target).val());
            this.$btnAdd.prop('disabled', true);
        } else  this.$btnAdd.prop('disabled', false);
    };

    TodoList.prototype.toggle = function (event) {
        var $li = $(event.target).closest('li');
        var $editTask = $li.find('#' + this.config.textAreaEditTaskId);
        var $task = $li.find('#' + this.config.taskId);

        if ($li.find('#' + this.config.btnDoneTaskId).is(":checked")) {
            $li.find('#' + this.config.btnRemoveTaskId).toggle(event.type === 'mouseenter');
            $li.find('#' + this.config.btnDoneTaskId).toggle(event.type === 'mouseenter');
        } else {
            TodoListUtilService().switchValueTask($task, $editTask);

            $editTask.toggle(event.type === 'mouseenter');
            $task.toggle(event.type === 'mouseleave');

            $li.find('#' + this.config.btnSaveEditTaskId).prop('disabled', true);

            $li.find('#' + this.config.btnRemoveTaskId).toggle(event.type === 'mouseenter');
            $li.find('#' + this.config.btnDoneTaskId).toggle(event.type === 'mouseenter');
            $li.find('#' + this.config.btnSaveEditTaskId).toggle(event.type === 'mouseenter');
        }
    };

    TodoList.prototype.done = function () {
        var $str = $(event.target).closest('li').find('#' + this.config.taskId).text();
        $(event.target).closest('li').remove();
        $(event.target).is(":checked") ? this.createDoneTask($str) : this.createTask($str);
    };

    TodoList.prototype.update = function () {
        var $li = $(event.target).closest('li');
        var $editTask = $li.find('#' + this.config.textAreaEditTaskId);
        var $task = $li.find('#' + this.config.taskId);

        util.switchValueTask($editTask, $task);

        $li.find('#' + this.config.btnSaveEditTaskId).prop('disabled', true);
    };

    TodoList.prototype.destroy = function () {
        if (confirm('Do you want delete ID_TASK?')) {
            $(event.target).closest('li').slideToggle(300).remove();
            this.showMessage();
        }
    };

    TodoList.prototype.showMessage = function () {
        this.$input.focus();
        this.listIsEmpty() ? this.$messageUser.fadeIn(500) : this.$messageUser.hide();
    };

    TodoList.prototype.listIsEmpty = function () {
        return this.$todoList.children().length === 0;
    };

    $.fn.todoList = function (optioons) {
        new TodoList(this.first(), optioons);
        return this.first();
    }
}(jQuery));