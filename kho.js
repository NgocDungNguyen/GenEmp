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
    const quantityInput = document.getElementById('quantity');
    const noteInput = document.getElementById('note');
    const backupTable = document.getElementById('backupTable').getElementsByTagName('tbody')[0];

    addItemButton.addEventListener('click', function() {
        const itemName = itemNameInput.value.trim();
        const quantity = quantityInput.value.trim();
        const note = noteInput.value.trim();
        if (itemName && quantity) {
            const newRow = backupTable.insertRow();
            const cell1 = newRow.insertCell(0);
            const cell2 = newRow.insertCell(1);
            const cell3 = newRow.insertCell(2);
            const cell4 = newRow.insertCell(3);
            const cell5 = newRow.insertCell(4);

            cell1.textContent = itemName;
            cell2.textContent = quantity;
            cell3.textContent = note;

            const history = [];
            history.push(`${new Date().toLocaleString()}, Thêm ${quantity}, ghi chú: ${note}`);

            const historyButton = document.createElement('button');
            historyButton.classList.add('btn');
            historyButton.textContent = 'Lịch Sử';
            historyButton.addEventListener('click', function() {
                showHistoryModal(history);
            });
            cell4.appendChild(historyButton);

            const actionsDiv = document.createElement('div');
            actionsDiv.classList.add('actions');
            const takeButton = document.createElement('button');
            takeButton.classList.add('take');
            takeButton.textContent = 'Rút Đồ';
            takeButton.addEventListener('click', function() {
                const takeAmount = prompt('Nhập số lượng rút:');
                const takeNote = prompt('Nhập ghi chú:');
                if (takeAmount && takeNote) {
                    takeItem(newRow, takeAmount, takeNote, history);
                }
            });
            const addButton = document.createElement('button');
            addButton.classList.add('add');
            addButton.textContent = 'Thêm Số Lượng';
            addButton.addEventListener('click', function() {
                const addAmount = prompt('Nhập số lượng thêm:');
                const addNote = prompt('Nhập ghi chú:');
                if (addAmount && addNote) {
                    addItem(newRow, addAmount, addNote, history);
                }
            });
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete');
            deleteButton.textContent = 'Xóa';
            deleteButton.addEventListener('click', function() {
                if (confirm('Bạn có chắc chắn muốn xóa mục này?')) {
                    newRow.remove();
                }
            });
            actionsDiv.appendChild(takeButton);
            actionsDiv.appendChild(addButton);
            actionsDiv.appendChild(deleteButton);
            cell5.appendChild(actionsDiv);

            itemNameInput.value = '';
            quantityInput.value = '';
            noteInput.value = '';
        }
    });

    function showHistoryModal(history) {
        const historyModal = document.getElementById('historyModal');
        const historyContent = document.getElementById('historyContent');
        historyContent.textContent = history.join('\n');
        historyModal.style.display = 'block';
    }

    document.querySelector('.close').addEventListener('click', function() {
        document.getElementById('historyModal').style.display = 'none';
    });

    function takeItem(row, amount, note, history) {
        const quantityCell = row.cells[1];
        const currentQuantity = parseInt(quantityCell.textContent, 10);
        const newQuantity = currentQuantity - parseInt(amount, 10);
        if (newQuantity >= 0) {
            quantityCell.textContent = newQuantity;
            history.push(`${new Date().toLocaleString()}, Rút ${amount}, ghi chú: ${note}`);
            alert(`Rút ${amount} đồ thành công. Ghi chú: ${note}`);
        } else {
            alert('Số lượng không đủ để rút.');
        }
    }

    function addItem(row, amount, note, history) {
        const quantityCell = row.cells[1];
        const currentQuantity = parseInt(quantityCell.textContent, 10);
        const newQuantity = currentQuantity + parseInt(amount, 10);
        quantityCell.textContent = newQuantity;
        history.push(`${new Date().toLocaleString()}, Thêm ${amount}, ghi chú: ${note}`);
        alert(`Thêm ${amount} đồ thành công. Ghi chú: ${note}`);
    }
});