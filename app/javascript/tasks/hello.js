const initializeTask = () => {
  const taskContainer = document.getElementById("task-phaserjs")
  if (!taskContainer) return

  console.log("Hello")
}

document.addEventListener("turbo:load", initializeTask)
