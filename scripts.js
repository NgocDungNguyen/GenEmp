document.addEventListener('DOMContentLoaded', function() {
    const weekSelect = document.getElementById('weekSelect');
    const currentDate = new Date();
    const currentWeek = getWeekNumber(currentDate);
    const itemTable = document.getElementById('itemTable') ? document.getElementById('itemTable').getElementsByTagName('tbody')[0] : null;
    const backupTable = document.getElementById('backupTable') ? document.getElementById('backupTable').getElementsByTagName('tbody')[0] : null;
    const addItemButton = document.getElementById('addItem');
    const itemNameInput = document.getElementById('itemName');
    const quantityInput = document.getElementById('quantity');
    const noteInput = document.getElementById('note');

    function generateWeekOptions(selectElement) {
        for (let i = 1; i <= currentWeek; i++) {
            const startDate = getStartDateOfWeek(i, currentDate.getFullYear());
            const endDate = getEndDateOfWeek(i, currentDate.getFullYear());
            const option = document.createElement('option');
            option.value = `Week ${i}`;
            option.textContent = `Week ${i} (${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()})`;
            selectElement.appendChild(option);
        }
    }

    generateWeekOptions(weekSelect);

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

    addItemButton.addEventListener('click', function() {
        const itemName = itemNameInput.value.trim();
        if (itemName) {
            if (itemTable) {
                const newRow = itemTable.insertRow();
                const cell1 = newRow.insertCell(0);
                const cell2 = newRow.insertCell(1);
                const cell3 = newRow.insertCell(2);
                const cell4 = newRow.insertCell(3);
                const cell5 = newRow.insertCell(4);

                cell1.textContent = itemName;

                const statusSelect = createStatusSelect();
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

            if (backupTable) {
                const quantity = quantityInput.value.trim();
                const note = noteInput.value.trim();
                if (quantity) {
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
            }
        }
    });

    function createStatusSelect() {
        const statusSelect = document.createElement('select');
        statusSelect.classList.add('status-dropdown');
        ['Tốt', 'Cần Sửa', 'Cần Thay Thế', 'Cần Vệ Sinh'].forEach(status => {
            const option = document.createElement('option');
            option.value = status;
            option.textContent = status;
            statusSelect.appendChild(option);
        });
        return statusSelect;
        }

        if (itemTable) {
            itemTable.addEventListener('click', function(event) {
                if (event.target.classList.contains('delete')) {
                    const row = event.target.closest('tr');
                    row.remove();
                } else if (event.target.classList.contains('priority')) {
                    const row = event.target.closest('tr');
                    row.classList.toggle('highlight');
                }
            });
        }
        
        function showHistoryModal(history) {
            const historyModal = document.getElementById('historyModal');
            const historyContent = document.getElementById('historyContent');
            historyContent.textContent = history.join('\n');
            historyModal.style.display = 'block';
        }
        
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
        
        // Code from script.js
        const weekDaysShifts = document.getElementById('week-days-shifts');
        let selectedCell = null;
        let selectedShift = null;
        
        if (weekDaysShifts) {
            generateWeekShifts(currentWeek);
        } else {
            const shiftTableBody = document.querySelector('#shift-table tbody');
            updateShiftTable(currentWeek);
        }
        
        function generateWeekShifts(week) {
            weekDaysShifts.innerHTML = '';
        
            const days = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];
            const shifts = ['Sáng (8h30-12h30)', 'Chiều (12h30-17h)', 'Tối (17h-22h)', 'Đêm (22h-1h30)'];
        
            days.forEach(day => {
                const daySlotDiv = document.createElement('div');
                daySlotDiv.className = 'day-slot';
                const dayLabel = document.createElement('label');
                dayLabel.textContent = day;
                daySlotDiv.appendChild(dayLabel);
        
                const slotOptionsDiv = document.createElement('div');
                slotOptionsDiv.className = 'slot-options';
        
                shifts.forEach(shift => {
                    const shiftOptionLabel = document.createElement('label');
                    const shiftCheckbox = document.createElement('input');
                    shiftCheckbox.type = 'checkbox';
                    shiftCheckbox.name = `${day.toLowerCase()}-shift`;
                    shiftCheckbox.value = shift;
                    shiftOptionLabel.appendChild(shiftCheckbox);
                    shiftOptionLabel.appendChild(document.createTextNode(shift));
                    slotOptionsDiv.appendChild(shiftOptionLabel);
                });
        
                daySlotDiv.appendChild(slotOptionsDiv);
                weekDaysShifts.appendChild(daySlotDiv);
            });
        }
        
        function updateShiftTable(week) {
            const { start, end } = getWeekDates(week);
            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        
            const thElements = document.querySelectorAll('#shift-table thead th');
            let currentDate = new Date(start);
            for (let i = 1; i <= 7; i++) {
                thElements[i].textContent = `${days[i - 1]} (${currentDate.getDate()}/${currentDate.getMonth() + 1})`;
                currentDate.setDate(currentDate.getDate() + 1);
            }
        
            shiftTableBody.innerHTML = '';
        
            const employees = [
                { name: 'Nguyen Van A', shifts: [['Sáng', 'Đêm'], [], [], [], [], [], []], note: 'Note A' },
                { name: 'Tran Thi B', shifts: [[], ['Chiều'], [], [], [], [], []], note: 'Note B' }
            ];
        
            if (employees.length === 0) {
                const noDataRow = document.createElement('tr');
                noDataRow.innerHTML = `<td colspan="9" class="text-center p-4">Không có dữ liệu cho tuần này.</td>`;
                shiftTableBody.appendChild(noDataRow);
            } else {
                employees.forEach(employee => {
                    const row = document.createElement('tr');
                    row.innerHTML = `<td class="border p-2">${employee.name}</td>` +
                        employee.shifts.map((shifts, dayIndex) => {
                            if (shifts.length === 0) return `<td class="border p-2"><i class="fas fa-plus add-shift" data-day="${dayIndex}"></i></td>`;
                            return `<td class="border p-2">${shifts.map(shift => {
                                if (shift === 'Sáng') return '<div class="shift-morning remove-shift"></div>';
                                if (shift === 'Chiều') return '<div class="shift-afternoon remove-shift"></div>';
                                if (shift === 'Tối') return '<div class="shift-evening remove-shift"></div>';
                                if (shift === 'Đêm') return '<div class="shift-night remove-shift"></div>';
                            }).join(' ')} <i class="fas fa-plus add-shift" data-day="${dayIndex}"></i></td>`;
                        }).join('') +
                        `<td class="border p-2">${employee.note}</td>`;
                    shiftTableBody.appendChild(row);
                });
            }
        
            document.querySelectorAll('.add-shift').forEach(button => {
                button.addEventListener('click', function() {
                    selectedCell = this.parentElement;
                    selectedCell.dataset.dayIndex = this.dataset.day;
                    document.getElementById('addShiftModal').style.display = 'block';
                });
            });
        
            document.querySelectorAll('.remove-shift').forEach(shift => {
                shift.addEventListener('click', function() {
                    selectedShift = this;
                    document.getElementById('removeShiftModal').style.display = 'block';
                });
            });
        }
        
        document.querySelectorAll('.close').forEach(closeButton => {
            closeButton.addEventListener('click', function() {
                document.getElementById(this.dataset.close).style.display = 'none';
            });
        });
        
        document.getElementById('addShiftButton').addEventListener('click', function() {
            const shiftType = document.getElementById('shift-select').value;
            const shiftDiv = document.createElement('div');
            shiftDiv.className = `shift-${shiftType.toLowerCase()} remove-shift`;
            shiftDiv.onclick = function() { openRemoveShiftModal(shiftDiv); };
            selectedCell.insertBefore(shiftDiv, selectedCell.querySelector('.fas.fa-plus'));
            closeModal('addShiftModal');
        });
        
        document.getElementById('removeShiftButton').addEventListener('click', function() {
            selectedShift.remove();
            closeModal('removeShiftModal');
            });
            function closeModal(modalId) {
                document.getElementById(modalId).style.display = 'none';
            }
            
            // Code from tailieu.js
            const categorySelect = document.getElementById('categorySelect');
            const uploadDocumentButton = document.getElementById('uploadDocument');
            const fileInput = document.getElementById('fileInput');
            const documentTable = document.getElementById('documentTable') ? document.getElementById('documentTable').getElementsByTagName('tbody')[0] : null;
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
                if (documentTable) {
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
