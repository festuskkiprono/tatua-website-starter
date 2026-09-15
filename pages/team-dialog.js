document.querySelectorAll('[data-team-dialog]').forEach(button => {
    button.addEventListener('click', () => {
        const dialog = document.getElementById('dialog-' + button.dataset.teamDialog);
        if (dialog) dialog.showModal();
    });
});