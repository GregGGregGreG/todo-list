/**
 * Created by greg on 21.04.15.
 */
(function ($) {
    var util = {
        formatText: function (str) {
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
            return str.trim()
                .replace(removeFirstSpace, '')
                .replace(removeDuplicateSpace, ' ')
                .replace(removeBlankRows, '\n')
                .replace(/\n/gm, "<br />\n");
        },
        getDate: function () {
            var monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

        function getDate(date) {
            return date.getDate() + ' ' +
                monthNames[date.getMonth()] + ' ' +
                date.getFullYear() + ' | ' +
                date.toLocaleTimeString();
        }

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
        messageUserText: 'You Todo - list is empty. Please add task.',

        inputId: 'input',
        btnAddId: 'btn-add',
        todoListId: 'todo-list',
        doneListId: 'done-list',
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
        doneListClass: 'done-list',
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
        }).focus().appendTo(this.$inputGroup);
        //Set aotosize input field
        autosize($('#' + this.config.inputId));

        //this.$inputGroupBtn = $('<span/>', {
        //    class: this.config.inputGroupBtnClass
        //}).appendTo(this.$inputGroup);

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

        this.$doneList = $('<ul/>', {
            id: this.config.doneListId,
            class: this.config.doneListClass
        }).appendTo(this.element);

    };

    TodoList.prototype.bindEvents = function () {
        var $this = this;

        this.$input.keyup(function (e) {
            var emptyInput = '';
            var enterBtnKeyCode = 13;
            var currentKeyCode = e.keyCode;

            var str = $this.$input.val().trim();

            if (str === emptyInput) {
                $this.$btnAdd.prop('disabled', true);
            } else if (currentKeyCode === enterBtnKeyCode) {
                $this.$btnAdd.click();
                $this.$btnAdd.prop('disabled', true);
            } else  $this.$btnAdd.prop('disabled', false);

        });

        this.$btnAdd.on('click', this.createTask.bind(this));

        this.$todoList.delegate('#' + this.config.btnDoneTaskId, 'click', $this.done.bind(this, 0));
        this.$doneList.delegate('#' + this.config.btnDoneTaskId, 'click', $this.done.bind(this, 1));

        this.$todoList.delegate('#' + this.config.textAreaEditTaskId, 'keyup', function () {
            var $li = $(this).closest('li');
            var $editTask = $li.find('#' + $this.config.textAreaEditTaskId);
            var $btnSaveEditTask = $li.find('#' + $this.config.btnSaveEditTaskId);

    function addTask(input) {
        var str = ($.type(input) === 'string') ? input : this.$input.val();
        this.createTaskHtml(str).prependTo(this.$todoList);

        autosize($('#' + this.config.textAreaEditTaskId));
        this.$input.val('');
        this.$input.css('height', '34px');
        this.$btnAdd.prop('disabled', true);
        this.showMessage();
    }

    function addDoneTask(str) {
        this.createDoneTaskHtml(str).appendTo(this.$todoList);
        this.$input.focus();
    }

        this.$todoList.delegate('#' + this.config.btnSaveEditTaskId, 'click', function () {
            var $li = $(this).closest('li');
            var $editTask = $li.find('#' + $this.config.textAreaEditTaskId);
            var $task = $li.find('#' + $this.config.taskId);

    function updateKeyUp() {
        var $li = $(event.target).closest('li');
        var $editTask = $li.find('#' + this.config.textAreaEditTaskId);
        var $btnSaveEditTask = $li.find('#' + this.config.btnSaveEditTaskId);

            $li.find('#' + $this.config.btnSaveEditTaskId).prop('disabled', true);
        });

        this.$todoList.delegate('#' + this.config.btnRemoveTaskId, 'click', $this.destroy.bind(this));
        this.$doneList.delegate('#' + this.config.btnRemoveTaskId, 'click', $this.destroy.bind(this));

        this.$todoList.delegate('li', 'mouseenter mouseleave', function (event) {
            var $li = $(this).closest('li');
            var $editTask = $li.find('#' + $this.config.textAreaEditTaskId);
            var $task = $li.find('#' + $this.config.taskId);

    function inputKeyUp(e) {
        if (!$(event.target).val().trim()) {
            this.$btnAdd.prop('disabled', true);
        } else if (e.ctrlKey && e.keyCode === enterBtnKeyCode) {
            this.addTask($(event.target).val());
            this.$btnAdd.prop('disabled', true);
        } else this.$btnAdd.prop('disabled', false);
    }

            $editTask.toggle(event.type === 'mouseenter');
            $task.toggle(event.type === 'mouseleave');

            $li.find('#' + $this.config.btnSaveEditTaskId).prop('disabled', true);

            $li.find('#' + $this.config.btnRemoveTaskId).toggle(event.type === 'mouseenter');
            $li.find('#' + $this.config.btnDoneTaskId).toggle(event.type === 'mouseenter');
            $li.find('#' + $this.config.btnSaveEditTaskId).toggle(event.type === 'mouseenter');
        });
        this.$doneList.delegate('li', 'mouseenter mouseleave', function (event) {
            var $li = $(this).closest('li');
            $li.find('#' + $this.config.btnRemoveTaskId).toggle(event.type === 'mouseenter');
            $li.find('#' + $this.config.btnDoneTaskId).toggle(event.type === 'mouseenter');
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
            type:'checkbox',
            id: this.config.btnDoneTaskId,
            class: this.config.btnDoneTaskClass
        }).appendTo(this.$li);

    /**
     * Remove select task  from todo-list.
     * Show message from user if is empty todo-list
     * Destroy task.
     */
    function destroy() {
        if (confirm('Do you want delete ID_TASK?')) {
            $(event.target).closest('li').remove();
            this.showMessage();
        }
    }

    /**
     * Show message for users about that todo-list is Empty!
     */
    function showMessage() {
        this.$input.focus();
        this.listIsEmpty() ? this.$messageUser.fadeIn(500) : this.$messageUser.hide();
    }

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
        }).appendTo(this.$doneList);

        this.$task = $('<div/>', {
            id: this.config.taskId
        }).css({
            'text-decoration': 'line-through'
        }).html(util.formatText(str))
            .appendTo(this.$li);

        this.$buttonDone = $('<input/>', {
            type:'checkbox',
            id: this.config.btnDoneTaskId,
            class: this.config.btnDoneTaskClass
        }).appendTo(this.$li);

        this.$buttonRemove = $('<span/>', {
            id: this.config.btnRemoveTaskId,
            class: this.config.btnRemoveTaskClass
        }).appendTo(this.$li);

        this.$input.val('');
    };

    TodoList.prototype.done = function (list) {
        var $li = $(event.target).closest('li');
        var str = $li.find('#' + this.config.taskId).text();
        list === 1 ? this.createTask(str) : this.createDoneTask(str);
        $li.remove();
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