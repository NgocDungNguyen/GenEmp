document.addEventListener('DOMContentLoaded', function() {
    const currentWeek = 23; // Example, current week is 23
    const weekSelect = document.getElementById('week-select');
    const shiftTableBody = document.querySelector('#shift-table tbody');
    const weekDaysShifts = document.getElementById('week-days-shifts');
    let selectedCell = null;
    let selectedShift = null;

    // Generate weeks dynamically
    for (let week = 1; week <= currentWeek; week++) {
        const option = document.createElement('option');
        option.value = week;
        option.text = `Tuần ${week} (${getWeekDates(week).start.toLocaleDateString()} - ${getWeekDates(week).end.toLocaleDateString()})`;
        weekSelect.appendChild(option);
    }

    // When user selects a week
    weekSelect.addEventListener('change', function() {
        const selectedWeek = parseInt(this.value);
        if (weekDaysShifts) {
            generateWeekShifts(selectedWeek);
        } else {
            updateShiftTable(selectedWeek);
        }
    });

    function getWeekDates(weekNumber) {
        // Mock function to get start and end dates of the week
        const startDate = new Date(2024, 0, 1 + (weekNumber - 1) * 7);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        return { start: startDate, end: endDate };
    }

    function generateWeekShifts(week) {
        // Xóa các khung giờ cũ
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

    if (weekDaysShifts) {
        generateWeekShifts(currentWeek); // Tạo khung giờ làm việc cho tuần hiện tại mặc định
    } else {
        updateShiftTable(currentWeek); // Display current week's shift table by default
    }

    function updateShiftTable(week) {
        const { start, end } = getWeekDates(week);
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        // Update table header with dates
        const thElements = document.querySelectorAll('#shift-table thead th');
        let currentDate = new Date(start);
        for (let i = 1; i <= 7; i++) {
            thElements[i].textContent = `${days[i - 1]} (${currentDate.getDate()}/${currentDate.getMonth() + 1})`;
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Clear old rows
        shiftTableBody.innerHTML = '';

        // Mock data for employees
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

        // Add event listeners for shift modals
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
});


