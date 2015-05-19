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
        /**
         *Format text task.
         * Remove first and last space.
         * Remove duplicate space.
         * And replace <br>\n to \n
         *
         * @param str
         * @returns {string}
         */
        function formatText(str) {
            return str.trim()
                .replace(removeFirstSpace, '')
                .replace(removeDuplicateSpace, ' ')
                .replace(removeBlankRows, '\n')
                .replace(/\n/gm, "<br />\n");
        }

        /**
         * Create date creating task
         * in format:
         * 18 May 2015 | 15:00:59
         * @param date
         * @returns {string}
         */
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
        messageUserText: 'You Todo - list is empty! Please add task.',

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

        this.$input = $('<textarea/>', {
            id: this.config.inputId,
            class: this.config.inputClass,
            placeholder: " What do you have in mind this time?",
            rows: '1'
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
        }).prop('disabled', true).appendTo(this.$inputGroup);


        this.$messageUser = $('<h3/>', {
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
     * Create li with task , button done, update ,and destroy.
     * Adding for date creating.
     * @param str
     * @returns  {html element li}
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

    /**
     * Create li with task,button destroy and done.
     * @param str
     * @returns {html element li}
     */
    function createDoneTaskHtml(str) {
        return $(this.$li()).css({'color': '#999999'}).append(
            $(this.$task(str)).css({'text-decoration': 'line-through'}),
            $(this.$buttonDone()).prop('checked', true),
            $(this.$buttonDestroy())
        );
    }

    /**
     * Add to todo list new task in first place with autosize contain
     * @param input
     */
    function addTask(input) {
        var str = ($.type(input) === 'string') ? input : this.$input.val();
        this.createTaskHtml(str).prependTo(this.$todoList);

        autosize($('#' + this.config.textAreaEditTaskId));
        this.$input.val('');
        this.$input.css('height', '34px');
        this.$btnAdd.prop('disabled', true);
        this.showMessage();
    }

    /**
     * Set done select task and by adding it to the todo-list end.
     *
     * @param str
     */
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

    /**
     * Event for text area set task when editing.
     * If you hover over the text of the content is copied to the task tekst area and becomes editable
     */
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

    /**
     * Event for input text field.
     * Create new task if user click ctr+enter.
     * @param e
     */
    function inputKeyUp(e) {
        if (!$(event.target).val().trim()) {
            this.$btnAdd.prop('disabled', true);
        } else if (e.ctrlKey && e.keyCode === enterBtnKeyCode) {
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
     * The task gets done. It becomes the end of the list. Remove buttons
     * editing and creation date
     *
     * Set task done.
     */
    function done() {
        var str = $(event.target).closest('li').find('#' + this.config.taskId).text();
        $(event.target).closest('li').remove();
        $(event.target).is(":checked") ? this.addDoneTask(str) : this.cancelTask(str);
    }

    /**
     *
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
     * Show modal window.
     * Remove select task  from todo-list.
     * Show message from user if is empty todo-list
     * Destroy task.
     */
    function destroy() {
        var li = $(event.target).closest('li');
        var thisObj = this;
        $("#myModal").modal('show').on('click', '#delete', function () {
            li.remove();
            thisObj.showMessage();
        }).on('shown.bs.modal', function () {
            $('#delete').focus();
        })
    }

    /**
     * Show message for users about that todo-list is Empty!
     */
    function showMessage() {
        this.$input.focus();
        this.listIsEmpty() ? this.$messageUser.fadeIn(900) : this.$messageUser.hide();
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