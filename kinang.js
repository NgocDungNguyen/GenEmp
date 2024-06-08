document.addEventListener('DOMContentLoaded', function() {
    const addEmployeeButton = document.getElementById('addEmployee');
    const employeeNameInput = document.getElementById('employeeName');
    const employeeTable = document.getElementById('employeeTable').getElementsByTagName('tbody')[0];

    addEmployeeButton.addEventListener('click', function() {
        const employeeName = employeeNameInput.value.trim();
        if (employeeName) {
            const newRow = employeeTable.insertRow();
            const cell1 = newRow.insertCell(0);
            const cell2 = newRow.insertCell(1);
            const cell3 = newRow.insertCell(2);
            const cell4 = newRow.insertCell(3);
            const cell5 = newRow.insertCell(4);
            const cell6 = newRow.insertCell(5);
            const cell7 = newRow.insertCell(6);
            const cell8 = newRow.insertCell(7);
            const cell9 = newRow.insertCell(8);
            const cell10 = newRow.insertCell(9);
            const cell11 = newRow.insertCell(10);
            const cell12 = newRow.insertCell(11);

            cell1.textContent = employeeName;

            const quầyCheckbox = document.createElement('input');
            quầyCheckbox.type = 'checkbox';
            cell2.appendChild(quầyCheckbox);

            const skills = ['Gone', 'GUM', 'HNS', 'AM', 'Ngải 1', 'Ngải 2', 'CHĐ', 'RRLM'];
            skills.forEach((skill, index) => {
                const checkboxGroup = document.createElement('div');
                checkboxGroup.classList.add('checkbox-group');
                ['Flow', 'Diễn', 'DJ'].forEach(type => {
                    const label = document.createElement('label');
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    label.appendChild(checkbox);
                    label.appendChild(document.createTextNode(type));
                    checkboxGroup.appendChild(label);
                });
                newRow.cells[index + 2].appendChild(checkboxGroup);
            });

            const đăngKíGroup = document.createElement('div');
            đăngKíGroup.classList.add('checkbox-group');
            ['Đã đki', 'Chưa đki'].forEach(type => {
                const label = document.createElement('label');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(type));
                đăngKíGroup.appendChild(label);
            });
            cell11.appendChild(đăngKíGroup);

            const actionsDiv = document.createElement('div');
            actionsDiv.classList.add('actions');
            const saveButton = document.createElement('button');
            saveButton.classList.add('save');
            saveButton.textContent = 'Lưu';
            saveButton.addEventListener('click', function() {
                alert('Lưu thành công');
            });
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete');
            deleteButton.textContent = 'Xóa';
            deleteButton.addEventListener('click', function() {
                if (confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
                    newRow.remove();
                }
            });
            actionsDiv.appendChild(saveButton);
            actionsDiv.appendChild(deleteButton);
            cell12.appendChild(actionsDiv);

            employeeNameInput.value = '';
        }
    });
});