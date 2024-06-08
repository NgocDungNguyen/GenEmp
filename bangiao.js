document.addEventListener('DOMContentLoaded', function() {
    const weekSelect = document.getElementById('weekSelect');
    const currentDate = new Date();
    const currentWeek = getWeekNumber(currentDate);
    for (let i = 1; i <= currentWeek; i++) {
        const startDate = getStartDateOfWeek(i, currentDate.getFullYear());
        const endDate = getEndDateOfWeek(i, currentDate.getFullYear());
        const option = document.createElement('option');
        option.value = `Week ${i}`;
        option.textContent = `Week ${i} (${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()})`;
        weekSelect.appendChild(option);
    }

    function getWeekNumber(d) {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        return weekNo;
    }

    function getStartDateOfWeek(weekNo, year) {
        const firstDayOfYear = new Date(year, 0, 1);
        const days = (weekNo - 1) * 7;
        const startDate = new Date(firstDayOfYear.setDate(firstDayOfYear.getDate() + days));
        const dayOfWeek = startDate.getDay();
        const ISOweekStart = startDate;
        if (dayOfWeek <= 4) {
            ISOweekStart.setDate(startDate.getDate() - startDate.getDay() + 1);
        } else {
            ISOweekStart.setDate(startDate.getDate() + 8 - startDate.getDay());
        }
        return ISOweekStart;
    }

    function getEndDateOfWeek(weekNo, year) {
        const startDate = getStartDateOfWeek(weekNo, year);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        return endDate;
    }

    const addItemButton = document.getElementById('addItem');
    const itemNameInput = document.getElementById('itemName');
    const bangiaoTable = document.getElementById('bangiaoTable').getElementsByTagName('tbody')[0];

    addItemButton.addEventListener('click', function() {
        const itemName = itemNameInput.value.trim();
        if (itemName) {
            const newRow = bangiaoTable.insertRow();
            const cell1 = newRow.insertCell(0);
            const cell2 = newRow.insertCell(1);
            const cell3 = newRow.insertCell(2);
            const cell4 = newRow.insertCell(3);
            const cell5 = newRow.insertCell(4);

            cell1.textContent = itemName;

            const statusSelect = document.createElement('select');
            statusSelect.classList.add('status-dropdown');
            ['Tốt', 'Cần Sửa', 'Cần Thay Thế', 'Cần Vệ Sinh'].forEach(status => {
                const option = document.createElement('option');
                option.value = status;
                option.textContent = status;
                statusSelect.appendChild(option);
            });
            cell2.appendChild(statusSelect);

            const noteInput = document.createElement('input');
            noteInput.type = 'text';
            cell3.appendChild(noteInput);

            const completeCheckbox = document.createElement('input');
            completeCheckbox.type = 'checkbox';
            cell4.appendChild(completeCheckbox);

            const actionsDiv = document.createElement('div');
            actionsDiv.classList.add('actions');
            const priorityButton = document.createElement('button');
            priorityButton.classList.add('priority');
            priorityButton.textContent = 'Ưu tiên';
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete');
            deleteButton.textContent = 'Xóa';
            actionsDiv.appendChild(priorityButton);
            actionsDiv.appendChild(deleteButton);
            cell5.appendChild(actionsDiv);

            itemNameInput.value = '';
        }
    });

    bangiaoTable.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete')) {
            const row = event.target.closest('tr');
            row.remove();
        } else if (event.target.classList.contains('priority')) {
            const row = event.target.closest('tr');
            row.classList.toggle('highlight');
        }
    });
});
