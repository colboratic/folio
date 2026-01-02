import React, { useMemo, useState } from 'react';

function CycleCalendar({ lastPeriod, cycleLength }) {
  const [selectedMonth, setSelectedMonth] = useState(0);

  const months = useMemo(() => {
    const startDate = new Date(lastPeriod);
    const monthsData = [];

    // สร้างปฏิทิน 12 เดือน โดยเริ่มจากเดือนที่ผู้ใช้เลือก
    for (let i = 0; i < 12; i++) {
      const monthDate = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
      const year = monthDate.getFullYear();
      const month = monthDate.getMonth();

      const days = [];
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = firstDay.getDay();

      // เติมวันว่างจากเดือนที่แล้ว
      for (let j = 0; j < startingDayOfWeek; j++) {
        days.push({ date: null, type: 'other-month' });
      }

      // เติมวันของเดือนปัจจุบัน
      for (let j = 1; j <= daysInMonth; j++) {
        const currentDate = new Date(year, month, j);
        let type = '';

        // คำนวณรอบเดือนทั้งปี
        const daysDiff = Math.floor((currentDate - new Date(lastPeriod)) / (1000 * 60 * 60 * 24));
        const cyclePosition = daysDiff % cycleLength;

        // วันเริ่มรอบเดือน (5 วันแรก)
        if (cyclePosition >= 0 && cyclePosition < 5) {
          type = 'period';
        }
        // วันตกไข่ (ใช้ช่วงกว้างขึ้น)
        else if (cyclePosition === Math.round(cycleLength / 2) - 1 || cyclePosition === Math.round(cycleLength / 2)) {
          type = 'ovulation';
        }
        // ช่วงอุดมสมบูรณ์
        else if (cyclePosition >= Math.round(cycleLength / 2) - 5 && cyclePosition <= Math.round(cycleLength / 2) + 1) {
          type = 'fertile';
        }

        // ตรวจสอบวันปัจจุบัน
        const today = new Date();
        if (
          currentDate.getDate() === today.getDate() &&
          currentDate.getMonth() === today.getMonth() &&
          currentDate.getFullYear() === today.getFullYear()
        ) {
          type = type ? `${type} today` : 'today';
        }

        days.push({
          date: j,
          fullDate: currentDate,
          type: type || '',
        });
      }

      // เติมวันว่างจากเดือนถัดไป
      const totalCells = 42; // 6 สัปดาห์ × 7 วัน
      const remainingCells = totalCells - days.length;
      for (let j = 0; j < remainingCells; j++) {
        days.push({ date: null, type: 'other-month' });
      }

      monthsData.push({
        month,
        year,
        monthName: new Date(year, month).toLocaleDateString('th-TH', { month: 'long', year: 'numeric' }),
        days
      });
    }

    return monthsData;
  }, [lastPeriod, cycleLength]);

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2>📆 ปฏิทินเต็มปี</h2>
        <div className="month-nav">
          <button 
            className="month-nav-btn"
            onClick={() => setSelectedMonth(Math.max(0, selectedMonth - 1))}
            disabled={selectedMonth === 0}
          >
            ◀
          </button>
          <span className="month-indicator">{selectedMonth + 1} / 12</span>
          <button 
            className="month-nav-btn"
            onClick={() => setSelectedMonth(Math.min(11, selectedMonth + 1))}
            disabled={selectedMonth === 11}
          >
            ▶
          </button>
        </div>
      </div>

      <div className="legend">
        <div className="legend-item">
          <div className="legend-color period-color"></div>
          <span>วันเดือนมา</span>
        </div>
        <div className="legend-item">
          <div className="legend-color ovulation-color"></div>
          <span>วันตกไข่</span>
        </div>
        <div className="legend-item">
          <div className="legend-color fertile-color"></div>
          <span>ช่วงอุดมสมบูรณ์</span>
        </div>
        <div className="legend-item">
          <div className="legend-color today-color"></div>
          <span>วันปัจจุบัน</span>
        </div>
      </div>

      <div className="calendar-months">
        {months.map((monthData, idx) => (
          <div 
            key={idx} 
            className={`month ${idx === selectedMonth ? 'highlighted' : ''}`}
          >
            <div className="month-header">{monthData.monthName}</div>

            <div className="weekdays">
              {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map((day, i) => (
                <div key={i} className={`weekday ${i === 0 || i === 6 ? 'weekend' : ''}`}>
                  {day}
                </div>
              ))}
            </div>

            <div className="days">
              {monthData.days.map((day, idx) => (
                <div
                  key={idx}
                  className={`day ${day.type}`}
                  title={day.fullDate ? day.fullDate.toLocaleDateString('th-TH', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : ''}
                >
                  {day.date}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CycleCalendar;
