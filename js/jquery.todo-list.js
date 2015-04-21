/**
 * Created by greg on 21.04.15.
 */
(function ($) {
    var util = {
        formatText: function (str) {
            var removeFirstSpace = /^[ \t]*/gm;
            var removeDuplicateSpace = /[ \t]{2,}/gm;
            var removeBlankRows = /^\n{3,}/gm;

            return str.replace(removeFirstSpace, '')
                .trim()
                .replace(removeDuplicateSpace, ' ')
                .replace(removeBlankRows, '\n')
                .replace(/\n/gm, "<br />\n");
        },
        getDate: function () {
            var monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            var date = new Date().getDate();
            var month = monthNames[new Date().getMonth()];
            var year = new Date().getFullYear();
            var time = new Date().toLocaleTimeString();

            return date + ' ' + month + ' ' + ' ' + year + ' | ' + time;
        },
        switchValueTask: function (from, to) {
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
    };

    var defaults = {
        btnAddText: 'Add',

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
        btnEditTaskClass: 'btn-edit'
    };

    function TodoList(element, options) {
        this.config = $.extend({}, defaults, options);
        this.element = element;
        this.init();
        this.bindEvents();
    }

    TodoList.prototype.init = function () {

        this.$inputGroup = $('<div/>', {
            class: this.config.inputGroupClass
        }).appendTo(this.element);

        this.$input = $('<input/>', {
            id: this.config.inputId,
            class: this.config.inputClass
        }).appendTo(this.$inputGroup)
            .focus();

        this.$inputGroupBtn = $('<span/>', {
            class: this.config.inputGroupBtnClass
        }).appendTo(this.$inputGroup);

        this.$btnAdd = $('<button/>', {
            text: this.config.btnAddText,
            id: this.config.btnAddId,
            class: this.config.btnAddClass
        }).prop('disabled', true)
            .appendTo(this.$inputGroupBtn);

        this.$todoList = $('<ul/>', {
            id: this.config.todoListId,
            class: this.config.todoListClass
        }).appendTo(this.element);

    };

    TodoList.prototype.bindEvents = function () {
        var $this = this;

        this.$input.keyup(function (e) {
            var emptyInput = '';
            var enterBtnKeyCode = 13;
            var currentKeyCode = e.keyCode;

            var str = $(e.target).val().trim();

            if (str === emptyInput) {
                $this.$btnAdd.prop('disabled', true);
            } else if (currentKeyCode === enterBtnKeyCode) {
                $this.createTask();
                $this.$btnAdd.prop('disabled', true);
            } else  $this.$btnAdd.prop('disabled', false);

        });

        this.$btnAdd.on('click', this.createTask.bind(this));

        this.$todoList.delegate('#' + this.config.btnDoneTaskId, 'click', this.done.bind(this, 0));

        this.$todoList.delegate('#' + this.config.textAreaEditTaskId, 'keyup', function () {
            var $li = $(this).closest('li');
            var $editTask = $li.find('#' + $this.config.textAreaEditTaskId);
            var $btnSaveEditTask = $li.find('#' + $this.config.btnSaveEditTaskId);

            var str = $li.find('#' + $this.config.taskId).text();
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
        });

        this.$todoList.delegate('#' + this.config.btnSaveEditTaskId, 'click', function () {
            var $li = $(this).closest('li');
            var $editTask = $li.find('#' + $this.config.textAreaEditTaskId);
            var $task = $li.find('#' + $this.config.taskId);

            util.switchValueTask($editTask, $task);

            $li.find('#' + $this.config.btnSaveEditTaskId).prop('disabled', true);
        });

        this.$todoList.delegate('#' + this.config.btnRemoveTaskId, 'click', this.destroy.bind(this));

        this.$todoList.delegate('li', 'mouseenter mouseleave', function (event) {
            var $li = $(event.target).closest('li');
            var $editTask = $li.find('#' + $this.config.textAreaEditTaskId);
            var $task = $li.find('#' + $this.config.taskId);

            if ($li.find('#' + $this.config.btnDoneTaskId).is(":checked")) {
                $li.find('#' + $this.config.btnRemoveTaskId).toggle(event.type === 'mouseenter');
                $li.find('#' + $this.config.btnDoneTaskId).toggle(event.type === 'mouseenter');
            } else {
                util.switchValueTask($task, $editTask);

                $editTask.toggle(event.type === 'mouseenter');
                $task.toggle(event.type === 'mouseleave');

                $li.find('#' + $this.config.btnSaveEditTaskId).prop('disabled', true);

                $li.find('#' + $this.config.btnRemoveTaskId).toggle(event.type === 'mouseenter');
                $li.find('#' + $this.config.btnDoneTaskId).toggle(event.type === 'mouseenter');
                $li.find('#' + $this.config.btnSaveEditTaskId).toggle(event.type === 'mouseenter');
            }
        });
    };

    TodoList.prototype.createTask = function (str) {

        this.$li = $('<li/>', {
            class: this.config.liTodoClass
        });

        this.$textAreaEditTask = $('<textarea/>', {
            id: this.config.textAreaEditTaskId,
            rows: '1'
        }).appendTo(this.$li)
            .hide();

        this.$task = $('<div/>', {
            id: this.config.taskId,
        }).html(util.formatText(this.$input.val() || str))
            .appendTo(this.$li);

        this.$buttonDone = $('<input/>', {
            type: 'checkbox',
            id: this.config.btnDoneTaskId,
            class: this.config.btnDoneTaskClass
        }).appendTo(this.$li);

        this.$buttonEdit = $('<button/>', {
            id: this.config.btnSaveEditTaskId,
            class: this.config.btnEditTaskClass
        }).addClass(this.config.btnEditTaskClass)
            .append($(document.createElement('span'))
                .addClass('glyphicon glyphicon-edit')
                .attr('aria-hidden', true))
            .appendTo(this.$li);

        this.$buttonRemove = $('<span/>', {
            id: this.config.btnRemoveTaskId,
            class: this.config.btnRemoveTaskClass
        }).appendTo(this.$li);

        this.dateAddingTask = $('<span/>', {
            id: this.config.dateAddingTask,
            text: util.getDate()
        }).appendTo(this.$li);

        this.$todoList.prepend(this.$li);
        autosize($('#' + this.config.textAreaEditTaskId));
        this.$input.val('');
    };

    TodoList.prototype.createDoneTask = function (str) {

        this.$li = $('<li/>', {
            class: this.config.liTodoClass
        }).css({
            'color': '#999999'
        }).appendTo(this.$todoList);

        this.$task = $('<div/>', {
            id: this.config.taskId
        }).css({
            'text-decoration': 'line-through'
        }).html(util.formatText(str))
            .appendTo(this.$li);

        this.$buttonDone = $('<input/>', {
            type: 'checkbox',
            checked: true,
            id: this.config.btnDoneTaskId,
            class: this.config.btnDoneTaskClass
        }).appendTo(this.$li);

        this.$buttonRemove = $('<span/>', {
            id: this.config.btnRemoveTaskId,
            class: this.config.btnRemoveTaskClass
        }).appendTo(this.$li);

        this.$input.val('');
    };

    TodoList.prototype.done = function () {
        var $str = $(event.target).closest('li').find('#' + this.config.taskId).text();
        $(event.target).closest('li').remove();
        $(event.target).is(":checked") ? this.createDoneTask($str) : this.createTask($str);
    };

    TodoList.prototype.destroy = function () {
        if (confirm('Do you want delete ID_TASK?')) {
            $(event.target).closest('li').slideToggle(300, function () {
                $(this).remove();
            });
        }
    };

    $.fn.todoList = function (optioons) {
        new TodoList(this.first(), optioons);
        return this.first();
    }
}(jQuery));