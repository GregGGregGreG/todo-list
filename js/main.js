/**
 * Created by greg on 19.05.15.
 */
$(function () {
    $('#todo-list').todoList({
        inputGroupTemplate: inputGroupTemplate,
        taskTemplate: taskTemplate,
        taskDoneTemplate:taskDoneTemplate,
        modalWindowDestroyTaskId:'destroyTaskModal',
        modalWindowDestroyButtonDestroyId:'delete'
    });
});
