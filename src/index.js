/* eslint-disable max-len */
// eslint-disable-next-line import/no-extraneous-dependencies, no-unused-vars
import _ from 'lodash';
import './style.css';

const inputTaskFormField = document.getElementById('inputTaskFormField');

const taskTodoHolder = document.getElementById('taskTodoHolder');

const clearAllCompleted = document.querySelector('.clear-all-completed');

const saveUserTaskToLocalStorage = (taskArray) => {
  localStorage.setItem('taskArray', JSON.stringify(taskArray));
};

const generateUI = (taskArray) => {
  taskTodoHolder.innerHTML = '';
  taskArray.forEach((item) => {
    const {
      description,
      index,
    } = item;

    const dataPlaceHolder = `
    <li class="each-todo-item">
        <input type="checkbox" id="checkBox" class="toggle-checkbox" data-id="${index}">
        <label for="todo-item" id="todoDescription" class="input-from-user">${description}</label>
        <button type="submit" class="more_vert" data-id="${index}">
        <i class="material-icons">more_vert</i>
        </button>
      </li>
    `;

    taskTodoHolder.innerHTML += dataPlaceHolder;
    inputTaskFormField.value = '';
  });

  const moreVert = document.querySelectorAll('.more_vert');

  const deleteUserTaskFromList = moreVert;

  deleteUserTaskFromList.forEach((element) => {
    element.addEventListener('click', () => {
      const elementIndex = taskArray.findIndex((isTask) => isTask.index === parseInt(element.dataset.id, 10));
      taskArray.splice(elementIndex, 1);
      for (let i = 0; i < taskArray.length; i += 1) {
        taskArray[i].index = i + 1;
      }
      saveUserTaskToLocalStorage(taskArray);
      generateUI(taskArray);
    });
  });

  const userTask = document.querySelectorAll('input-from-user');
  const userTaskDetails = userTask;

  userTaskDetails.forEach((inputDesc) => {
    inputDesc.addEventListener('focusout', () => {
      const inputDescId = taskArray.findIndex((isDesc) => isDesc.index === parseInt(inputDesc.dataset.id, 10));
      taskArray[inputDescId].description = inputDesc.value;
      const updateUserExistingTask = () => {
        generateUI(taskArray);
        saveUserTaskToLocalStorage(taskArray);
      };
      updateUserExistingTask();
    });
  });

  const checkBox = document.querySelectorAll('.toggle-checkbox');

  checkBox.forEach((item) => {
    item.addEventListener('change', (event) => {
      if (event.target.checked) {
        const checkBoxId = taskArray.findIndex((isTask) => isTask.index === parseInt(item.dataset.id, 10));
        taskArray[checkBoxId].completed = true;

        const strikeLine = document.getElementById('todoDescription');

        if (taskArray[checkBoxId].completed) {
          strikeLine.style.textDecoration = 'line-through';
        } else { strikeLine.style.textDecoration = 'none'; }

        saveUserTaskToLocalStorage(taskArray);
      } else {
        const checkBoxId = taskArray.findIndex((isTask) => isTask.index === parseInt(item.dataset.id, 10));
        taskArray[checkBoxId].completed = false;
        const strikeLine = document.getElementById('todoDescription');
        strikeLine.style.textDecoration = 'none';
        saveUserTaskToLocalStorage(taskArray);
      }
    });
  });

  clearAllCompleted.addEventListener('click', () => {
    const completedTask = taskArray.filter((item) => item.completed === false);
    generateUI(completedTask);
    saveUserTaskToLocalStorage(completedTask);
  });
};

const retrieveUserSavedTaskFromLocalStorage = () => {
  let retrievedTasks = [];
  if (localStorage.getItem('taskArray') !== null) {
    retrievedTasks = JSON.parse(localStorage.getItem('taskArray'));
  }
  return retrievedTasks;
};

window.addEventListener('load', () => {
  const retrievedTasks = retrieveUserSavedTaskFromLocalStorage();
  generateUI(retrievedTasks);
});

inputTaskFormField.addEventListener('keypress', (event) => {
  const retrievedTasks = retrieveUserSavedTaskFromLocalStorage();

  if (event.key === 'Enter') {
    const taskEmptyObject = {};
    taskEmptyObject.index = retrievedTasks.length + 1;
    taskEmptyObject.description = inputTaskFormField.value;
    taskEmptyObject.completed = false;

    retrievedTasks.push(taskEmptyObject);
    generateUI(retrievedTasks);
    saveUserTaskToLocalStorage(retrievedTasks);
  }
});
