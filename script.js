const add = document.getElementById("addbtn");
const done = document.getElementById("donebtn");
const dlt = document.getElementById("dltbtn");

window.onload = function () {
  console.log("Loading tasks from localStorage...");
  loadTasks();
};

const addTaskToDom = function (taskObject) {
  if (taskObject.isDeleted) return;
  const ulp = document.getElementById("items");
  const li = document.createElement("li");

  const tododiv = document.createElement("div");
  tododiv.className = "todo-item";

  const descdiv = document.createElement("div");
  descdiv.className = "desc";
  descdiv.innerHTML = taskObject.description;
  if (taskObject.isCompleted) {
    descdiv.classList.add("completed");
  }
  tododiv.appendChild(descdiv);

  const doneDiv = document.createElement("div");
  doneDiv.className = "done";
  const doneButton = document.createElement("button");
  doneButton.textContent = "Done";
  doneButton.addEventListener("click", function () {
    taskDone(li, taskObject.description);
    tododiv.removeChild(doneDiv);
  });
  if (!taskObject.isCompleted) {
    doneDiv.appendChild(doneButton);
  }

  tododiv.appendChild(doneDiv);

  const div = document.createElement("div");
  div.className = "delete";
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", function () {
    taskDelete(li, taskObject.description);
  });

  div.appendChild(deleteButton);
  tododiv.appendChild(div);
  li.appendChild(tododiv);

  if (ulp.firstChild) {
    ulp.insertBefore(li, ulp.firstChild);
  } else {
    ulp.appendChild(li);
  }
};

const loadTasks = function () {
  const tasks = getTasksFromLocalStorage();
  console.log("Tasks loaded from localStorage:", tasks);
  tasks.forEach((task) => addTaskToDom(task));
};
const addTask = function () {
  const input = document.getElementById("input-task");
  const task = input.value;

  if (task === "") {
    alert("Please enter a valid task");
    return;
  }

  const taskObject = {
    description: task,
    isCompleted: false,
    isDeleted: false,
  };

  const tasks = getTasksFromLocalStorage();
  tasks.push(taskObject);

  saveTasksToLocalStorage(tasks);

  addTaskToDom(taskObject);
  input.value = "";
};

const taskDelete = function (taskItem, description) {
  taskItem.className = "deleted";

  // ulp.removeChild(taskItem);

  updateTaskStatus(description, null, true);
};
const taskDone = function (taskItem, description) {
  taskItem.querySelector(".desc").classList.add("completed");
  const ulp = document.getElementById("items");

  ulp.appendChild(taskItem);
  updateTaskStatus(description, true);
};

const getTasksFromLocalStorage = function () {
  let tasks = localStorage.getItem("tasks");
  if (!tasks) {
    console.log("No tasks found in localStorage.");
    return [];
  }
  console.log("Retrieved tasks from localStorage:", JSON.parse(tasks));
  return JSON.parse(tasks);
};
const saveTasksToLocalStorage = function (tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  console.log("Tasks saved to localStorage:", tasks);
};

const updateTaskStatus = function (description, isCompleted, isDeleted) {
  const tasks = getTasksFromLocalStorage();
  const updatedTasks = tasks.map((task) => {
    if (task.description === description) {
      if (isCompleted !== null) task.isCompleted = isCompleted;
      if (isDeleted !== null) task.isDeleted = isDeleted;
    }
    return task;
  });
  saveTasksToLocalStorage(updatedTasks);
};

const removeTaskFromLocalStorage = function (description) {
  let tasks = getTasksFromLocalStorage();
  tasks = tasks.filter((task) => task.description !== description);
  saveTasksToLocalStorage(tasks);
};

add.addEventListener("click", addTask);
