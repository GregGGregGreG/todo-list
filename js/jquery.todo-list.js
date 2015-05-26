(function ($) {
    var oneRowHeightTextArea = 34;
    var enterBtnKeyCode = 13;
    var monthNames = [
        "January", "February", "March", "April", "May", "June",
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
            return str
                .trim()
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
        inputId: 'input',
        btnAddId: 'btn-add',
        todoListId: 'task-list',
        dateAddingTaskId: 'date',
        taskId: 'task',
        textAreaEditTaskId: 'edit-task',
        btnDoneTaskId: 'btn-done',
        btnRemoveTaskId: 'btn-remove',
        btnUpdateTaskId: 'btn-update',
        messageUserId: 'message-user',
        modalWindowDestroyTaskId: '',
        modalWindowDestroyButtonDestroyId: '',

        inputGroupTemplate: "<div >" +
        "<textarea id='${inputId}'></textarea>" +
        "<button id='${btnAddId}'>Add</button></div>" +
        "<h3 id='${messageUserId}'>You Todo - list is empty! Please add task.</h3>" +
        "<ul id='${todoListId}'></ul>",

        taskTemplate: "<li>" +
        "<div id='${taskId}'>{{html str}}</div>" +
        "<textarea id='${textAreaEditTaskId}' ></textarea>" +
        "<input id='${btnDoneTaskId}'  type='checkbox'/>" +
        "<button id='${btnUpdateTaskId}'>" + "<span class='glyphicon glyphicon-edit'></span>" + "</button>" +
        "<button id='${btnRemoveTaskId}' >Remove</button>" +
        "<span id='${dateAddingTaskId}'>${date}</span>" +
        "</li>",

        taskDoneTemplate: "<li class='${liTodoClass}'>" +
        "<div id='${taskId}' >{{html str}}</div>" +
        "<input id='${btnDoneTaskId}' type='checkbox' checked/>" +
        "<span id='${btnRemoveTaskId}'></sp>" +
        "</li>"
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
    TodoList.prototype.cancelTask = cancelTask;
    TodoList.prototype.addDoneTask = addDoneTask;
    TodoList.prototype.updateKeyUp = updateKeyUp;
    TodoList.prototype.inputKeyUp = inputKeyUp;
    TodoList.prototype.toggle = toggle;
    TodoList.prototype.done = done;
    TodoList.prototype.update = update;
    TodoList.prototype.destroy = destroy;
    TodoList.prototype.showMessage = showMessage;
    TodoList.prototype.listIsEmpty = listIsEmpty;
    TodoList.prototype.getCurrentStateTask = getCurrentStateTask;

    /**
     * Create input group: input and button for adding task, empty task-list.
     */
    function init() {
        $.template("inputTemplate", this.config.inputGroupTemplate);
        $.tmpl("inputTemplate", this.config).appendTo(this.element);
        //Set focus input
        this.$input = $('#' + this.config.inputId).focus();
        //Set aotosize input field
        autosize($('#' + this.config.inputId));

        this.$btnAdd = $('#' + this.config.btnAddId).prop('disabled', true);
        this.$messageUser = $('#' + this.config.messageUserId).hide();
        this.$todoList = $('#' + this.config.todoListId);

        var thisObj = this;
        $.ajax({
            type:'GET',
            url: "http://localhost:8080/greeting",
            success: function (data) {
                var str = JSON.stringify(data.content);
                console.log(str);
                thisObj.addTask(str);
            }
        })
    }

    /**
     * Events for click buttons: Add task, Destroy task, Update task, Done task and hover for task.
     */
    function bindEvents() {
        this.$btnAdd.on('click', this.addTask.bind(this));
        this.$input.keyup(this.inputKeyUp.bind(this));
        this.$todoList
            .delegate('#' + this.config.textAreaEditTaskId, 'keyup', this.updateKeyUp.bind(this))
            .delegate('#' + this.config.btnDoneTaskId, 'click', this.done.bind(this))
            .delegate('#' + this.config.btnUpdateTaskId, 'click', this.update.bind(this))
            .delegate('#' + this.config.btnRemoveTaskId, 'click', this.destroy.bind(this))
            .delegate('li', 'mouseenter mouseleave', this.toggle.bind(this));
    }

    /**
     * Create li with task , button done, update ,and destroy.
     * Adding for date creating.
     * @param str
     * @returns  {html element li}
     */
    function createTaskHtml(str) {
        this.config.str = util.formatText(str);
        this.config.date = util.getDate(new Date);
        $.template("taskTemplate", this.config.taskTemplate);
        return $.tmpl("taskTemplate", this.config);
    }

    /**
     * Create li with task,button destroy and done.
     * @param str
     * @returns {html element li}
     */
    function createDoneTaskHtml(str) {
        this.config.str = util.formatText(str);
        $.template("taskDoneTemplate", this.config.taskDoneTemplate);
        return $.tmpl("taskDoneTemplate", this.config);
    }

    /**
     * Add to todo list new task in first place with autosize contain
     * @param input
     */
    function addTask(input) {
        var str = ($.type(input) === 'string') ? input : this.$input.val();
        this.createTaskHtml(str).prependTo(this.$todoList);

        $('[data-toggle="tooltip"]').tooltip({delay: { "show": 500, "hide": 100 },container: 'body'});

        autosize($('#' + this.config.textAreaEditTaskId));
        this.$input.val('');
        this.$input.css('height', oneRowHeightTextArea);
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
        $('[data-toggle="tooltip"]').tooltip({delay: { "show": 500, "hide": 100 },container: 'body'});

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
        this.$input.focus();
    }

    /**
     * Event for text area set task when editing.
     * If you hover over the text of the content is copied to the task tekst area and becomes editable
     */
    function updateKeyUp(e) {
        var state = this.getCurrentStateTask();

        var currentText = state.$task.text();
        var inputText = state.$editTask.val().trim();
        // disabled update button
        state.$btnUpdateTask.prop('disabled', true);

        if (inputText === '') {
            state.$btnUpdateTask.prop('disabled', true);
            return;
        }

        if (currentText != inputText) {
            state.$btnUpdateTask.prop('disabled', false);
        }

        if (e.ctrlKey && e.keyCode === enterBtnKeyCode) {
            this.update();
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
        } else {
            this.$btnAdd.prop('disabled', false);
        }
    }

    function toggle(event) {
        var state = this.getCurrentStateTask();
        var eventType = event.type;

        if (state.$btnDoneTask.is(":checked")) {
            state.$btnRemoveTask.toggle(eventType === 'mouseenter');
            state.$btnDoneTask.toggle(eventType === 'mouseenter');
        } else {
            util.switchValueTask(state.$task, state.$editTask);

            state.$editTask.toggle(eventType === 'mouseenter');
            state.$task.toggle(eventType === 'mouseleave');

            state.$btnUpdateTask.prop('disabled', true);

            state.$btnRemoveTask.toggle(eventType === 'mouseenter');
            state.$btnDoneTask.toggle(eventType === 'mouseenter');
            state.$btnUpdateTask.toggle(eventType === 'mouseenter');
        }
    }

    /**
     * The task gets done. It becomes the end of the list. Remove buttons
     * editing and creation date
     *
     * Set task done.
     */
    function done() {
        var state = this.getCurrentStateTask();
        var str = state.$task.text();
        state.$li.remove();
        state.$btnDoneTask.is(":checked") ? this.addDoneTask(str) : this.cancelTask(str);
    }

    /**
     *
     * Update text task
     */
    function update() {
        var state = this.getCurrentStateTask();
        util.switchValueTask(state.$editTask, state.$task);
        state.$btnUpdateTask.prop('disabled', true);
    }

    /**
     * Show modal window.Focus in delete button
     * Remove select task with slide toogle from todo-list.
     * Show message from user if is empty todo-list
     * Destroy task.
     */
    function destroy() {
        var thisObj = this;
        var li = $(event.target).closest('li');
        $('#' + this.config.modalWindowDestroyTaskId).modal('show').on('click',
            '#' + this.config.modalWindowDestroyButtonDestroyId, function () {
                li.slideToggle(300, function () {
                    $(this).remove();
                    thisObj.showMessage();
                });
            }).on('shown.bs.modal', function () {
                $('#delete').focus();
            })
    }

    /**
     * Get current state task.
     * Find current task,edit task,btn update,remove,done.
     */
    function getCurrentStateTask() {
        return {
            $li: $(event.target).closest('li'),
            $task: $(event.target).closest('li').find('#' + this.config.taskId),
            $editTask: $(event.target).closest('li').find('#' + this.config.textAreaEditTaskId),
            $btnUpdateTask: $(event.target).closest('li').find('#' + this.config.btnUpdateTaskId),
            $btnDoneTask: $(event.target).closest('li').find('#' + this.config.btnDoneTaskId),
            $btnRemoveTask: $(event.target).closest('li').find('#' + this.config.btnRemoveTaskId)
        };
    }

    /**
     * Show message for users about that todo-list is Empty!
     */
    function showMessage() {
        this.$input.focus();
        this.listIsEmpty() ? this.$messageUser.slideDown(600) : this.$messageUser.hide();
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