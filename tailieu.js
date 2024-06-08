document.addEventListener('DOMContentLoaded', function() {
    const categorySelect = document.getElementById('categorySelect');
    const uploadDocumentButton = document.getElementById('uploadDocument');
    const fileInput = document.getElementById('fileInput');
    const documentTable = document.getElementById('documentTable').getElementsByTagName('tbody')[0];
    const viewModal = document.getElementById('viewModal');
    const documentViewer = document.getElementById('documentViewer');
    const closeModal = document.querySelector('.close');

    const documents = {};

    uploadDocumentButton.addEventListener('click', function() {
        fileInput.click();
    });

    fileInput.addEventListener('change', function() {
        const file = fileInput.files[0];
        if (file) {
            const category = categorySelect.value;
            if (!documents[category]) {
                documents[category] = [];
            }
            documents[category].push(file);
            renderDocumentTable(category);
        }
    });

    categorySelect.addEventListener('change', function() {
        const category = categorySelect.value;
        renderDocumentTable(category);
    });

    function renderDocumentTable(category) {
        documentTable.innerHTML = '';
        if (documents[category]) {
            documents[category].forEach((file, index) => {
                const newRow = documentTable.insertRow();
                const cell1 = newRow.insertCell(0);
                const cell2 = newRow.insertCell(1);

                cell1.textContent = file.name;

                const actionsDiv = document.createElement('div');
                actionsDiv.classList.add('actions');
                const viewButton = document.createElement('button');
                viewButton.classList.add('view');
                viewButton.textContent = 'Đọc';
                viewButton.addEventListener('click', function() {
                    viewDocument(file);
                });
                const downloadButton = document.createElement('button');
                downloadButton.classList.add('download');
                downloadButton.textContent = 'Download';
                downloadButton.addEventListener('click', function() {
                    downloadDocument(file);
                });
                const deleteButton = document.createElement('button');
                deleteButton.classList.add('delete');
                deleteButton.textContent = 'Xóa';
                deleteButton.addEventListener('click', function() {
                    deleteDocument(category, index);
                });
                actionsDiv.appendChild(viewButton);
                actionsDiv.appendChild(downloadButton);
                actionsDiv.appendChild(deleteButton);
                cell2.appendChild(actionsDiv);
            });
        }
    }

    function viewDocument(file) {
        const fileURL = URL.createObjectURL(file);
        documentViewer.src = fileURL;
        viewModal.style.display = 'block';
    }

    function downloadDocument(file) {
        const fileURL = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = fileURL;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function deleteDocument(category, index) {
        if (confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) {
            documents[category].splice(index, 1);
            renderDocumentTable(category);
        }
    }

    closeModal.addEventListener('click', function() {
        viewModal.style.display = 'none';
        documentViewer.src = '';
    });

    window.addEventListener('click', function(event) {
        if (event.target === viewModal) {
            viewModal.style.display = 'none';
            documentViewer.src = '';
        }
    });
});