/**
 * Created by greg on 21.04.15.
 */
(function ($) {
    var enterBtnKeyCode = 13;
    var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    var removeFirstSpace = /^[ \t]*/gm;
    var removeDuplicateSpace = /[ \t]{2,}/gm;
    var removeBlankRows = /^\n{3,}/gm;
    var util = TodoListUtilService();

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
        }

        function getDate(date) {
            return date.getDate() + ' ' +
                monthNames[date.getMonth()] + ' ' +
                date.getFullYear() + ' | ' +
                date.toLocaleTimeString();
        }

        function switchValueTask(from, to) {
            var str = !from.val() ? from.text() : formatText(from.val());
            //Use switch where value task from hover to static task
            if (!from.val()) {
                //to.val(str);
                to.val(str).height(from.height());
            } else {
                //Use switch where value task for save edit task
                to.html(str);
                //
                from.val(to.text()).height(to.height());
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

    TodoList.prototype.init = init;
    TodoList.prototype.bindEvents = bindEvents;
    TodoList.prototype.createTaskHtml = createTaskHtml;
    TodoList.prototype.createDoneTaskHtml = createDoneTaskHtml;
    TodoList.prototype.addTask = addTask;
    TodoList.prototype.addDoneTask = addDoneTask;
    TodoList.prototype.updateKeyUp = updateKeyUp;
    TodoList.prototype.inputKeyUp = inputKeyUp;
    TodoList.prototype.toggle = toggle;
    TodoList.prototype.done = done;
    TodoList.prototype.cancelTask = cancelTask;
    TodoList.prototype.update = update;
    TodoList.prototype.destroy = destroy;
    TodoList.prototype.showMessage = showMessage;
    TodoList.prototype.listIsEmpty = listIsEmpty;

    /**
     * Create input group: input and button for adding task, empty task-list.
     */
    function init() {

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
            return $('<div/>', {id: this.config.taskId}).html(util.formatText(str));
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

        this.$buttonUpdate = function () {
            return $('<button/>', {
                id: this.config.btnSaveEditTaskId,
                class: this.config.btnEditTaskClass
            }).addClass(this.config.btnEditTaskClass)
                .append($(document.createElement('span'))
                    .addClass('glyphicon glyphicon-edit')
                    .attr('aria-hidden', true));
        };

        this.$buttonDestroy = function () {
            return $('<span/>', {
                id: this.config.btnRemoveTaskId,
                class: this.config.btnRemoveTaskClass
            });
        };

        this.$dateAddingTask = function () {
            return $('<span/>', {
                id: this.config.dateAddingTask,
                text: util.getDate(new Date)
            });
        };
    }

    /**
     * Events for click buttons: Add task, Destroy task, Update task, Done task and hover for task.
     */
    function bindEvents() {
        this.$btnAdd.on('click', this.addTask.bind(this));
        this.$input.keyup(this.inputKeyUp.bind(this));
        this.$todoList.delegate('#' + this.config.textAreaEditTaskId, 'keyup', this.updateKeyUp.bind(this));
        this.$todoList.delegate('#' + this.config.btnDoneTaskId, 'click', this.done.bind(this));
        this.$todoList.delegate('#' + this.config.btnSaveEditTaskId, 'click', this.update.bind(this));
        this.$todoList.delegate('#' + this.config.btnRemoveTaskId, 'click', this.destroy.bind(this));
        this.$todoList.delegate('li', 'mouseenter mouseleave', this.toggle.bind(this));
    }

    /**
     * Create li for task , button done, update ,and destroy.
     * Adding for date creating.
     * @param str
     */
    function createTaskHtml(str) {
        return $(this.$li()).append(
            $(this.$textAreaEditTask()).hide(),
            $(this.$task(str)),
            $(this.$buttonDone()),
            $(this.$buttonUpdate()),
            $(this.$buttonDestroy()),
            $(this.$dateAddingTask())
        );
    }

    function createDoneTaskHtml(str) {
        return $(this.$li()).css({'color': '#999999'}).append(
            $(this.$task(str)).css({'text-decoration': 'line-through'}),
            $(this.$buttonDone()).prop('checked', true),
            $(this.$buttonDestroy())
        );
    }

    function addTask(input) {
        var str = ($.type(input) === 'string') ? input : this.$input.val();
        this.createTaskHtml(str).prependTo(this.$todoList);

        autosize($('#' + this.config.textAreaEditTaskId));
        this.$input.val('');
        this.$btnAdd.prop('disabled', true);
        this.showMessage();
    }

    function addDoneTask(str) {
        this.createDoneTaskHtml(str).appendTo(this.$todoList);
        this.$input.focus();
    }

    /**
     * From the text of the task execution creates a new task by adding it to the todo-list of the first tasks
     * of the new creation date
     * @param str
     */
    function cancelTask(str) {
        this.createTaskHtml(str).prependTo(this.$todoList);
        autosize($('#' + this.config.textAreaEditTaskId));
    }


    function updateKeyUp() {
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
    }

    function inputKeyUp(e) {
        if (!$(event.target).val().trim()) {
            this.$btnAdd.prop('disabled', true);
        } else if (e.keyCode === enterBtnKeyCode) {
            this.addTask($(event.target).val());
            this.$btnAdd.prop('disabled', true);
        } else this.$btnAdd.prop('disabled', false);
    }

    function toggle(event) {
        var eventType = event.type;
        var $li = $(event.target).closest('li');
        var $editTask = $li.find('#' + this.config.textAreaEditTaskId);
        var $task = $li.find('#' + this.config.taskId);

        if ($li.find('#' + this.config.btnDoneTaskId).is(":checked")) {
            $li.find('#' + this.config.btnRemoveTaskId).toggle(eventType === 'mouseenter');
            $li.find('#' + this.config.btnDoneTaskId).toggle(eventType === 'mouseenter');
        } else {
            util.switchValueTask($task, $editTask);

            $editTask.toggle(eventType === 'mouseenter');
            $task.toggle(eventType === 'mouseleave');

            $li.find('#' + this.config.btnSaveEditTaskId).prop('disabled', true);

            $li.find('#' + this.config.btnRemoveTaskId).toggle(eventType === 'mouseenter');
            $li.find('#' + this.config.btnDoneTaskId).toggle(eventType === 'mouseenter');
            $li.find('#' + this.config.btnSaveEditTaskId).toggle(eventType === 'mouseenter');
        }
    }

    /**
     * Set task done.
     */
    function done() {
        var str = $(event.target).closest('li').find('#' + this.config.taskId).text();
        $(event.target).closest('li').remove();
        $(event.target).is(":checked") ? this.addDoneTask(str) : this.cancelTask(str);
    }

    /**
     * Update text task
     */
    function update() {
        var $li = $(event.target).closest('li');
        var $editTask = $li.find('#' + this.config.textAreaEditTaskId);
        var $task = $li.find('#' + this.config.taskId);

        util.switchValueTask($editTask, $task);

        $li.find('#' + this.config.btnSaveEditTaskId).prop('disabled', true);
    }

    /**
     * Destroy task.
     */
    function destroy() {
        if (confirm('Do you want delete ID_TASK?')) {
            $(event.target).closest('li').slideToggle(300).remove();
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

    /**
     * Return true if todo-list is empty.If list doesn't empty return false.
     * @returns {boolean}
     */
    function listIsEmpty() {
        return this.$todoList.children().length === 0;
    }

    $.fn.todoList = function (optioons) {
        var element = this.first();
        new TodoList(element, optioons);
        return element;
    }
}(jQuery));