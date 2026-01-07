import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  List,
  Brain,
  Plus,
  Trash2,
  X,
} from "lucide-react";

export default function TimeBoxPlanner() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dailyData, setDailyData] = useState({});
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const motivationalQuotes = [
    "오늘 하루도 최선을 다해봐요! 💪",
    "작은 진전도 진전입니다! 🌟",
    "당신은 할 수 있어요! ✨",
    "오늘도 멋진 하루 되세요! 🎯",
    "한 걸음 한 걸음, 차근차근! 🚀",
    "당신의 노력은 빛을 발할 거예요! 💫",
    "오늘의 당신을 응원합니다! 🌈",
    "완벽하지 않아도 괜찮아요! 💝",
    "할 수 있다는 믿음이 반입니다! 🌻",
    "오늘 하루를 즐겨봐요! 🎨",
  ];

  const [dailyQuote] = useState(() => {
    return motivationalQuotes[
      Math.floor(Math.random() * motivationalQuotes.length)
    ];
  });

  const timeSlots = [
    "05:00",
    "05:30",
    "06:00",
    "06:30",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
    "23:30",
    "00:00",
    "00:30",
    "01:00",
    "01:30",
    "02:00",
    "02:30",
    "03:00",
    "03:30",
    "04:00",
    "04:30",
  ];

  useEffect(() => {
    const saved = localStorage.getItem("timeboxPlanner");
    if (saved) {
      setDailyData(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("timeboxPlanner", JSON.stringify(dailyData));
  }, [dailyData]);

  const getTodayData = () => {
    return (
      dailyData[selectedDate] || {
        todos: [],
        timeplan: {},
        braindump: "",
        timecatcher: {},
      }
    );
  };

  const updateTodayData = (updates) => {
    setDailyData({
      ...dailyData,
      [selectedDate]: {
        ...getTodayData(),
        ...updates,
      },
    });
  };

  const addTodo = () => {
    const todos = getTodayData().todos;
    updateTodayData({
      todos: [...todos, { id: Date.now(), text: "", completed: false }],
    });
  };

  const updateTodo = (id, updates) => {
    const todos = getTodayData().todos.map((todo) =>
      todo.id === id ? { ...todo, ...updates } : todo
    );
    updateTodayData({ todos });
  };

  const deleteTodo = (id) => {
    const todos = getTodayData().todos.filter((todo) => todo.id !== id);
    updateTodayData({ todos });
  };

  const updateTimeplan = (time, value) => {
    const timeplan = { ...getTodayData().timeplan, [time]: value };
    updateTodayData({ timeplan });
  };

  const updateBraindump = (value) => {
    updateTodayData({ braindump: value });
  };

  const changeDate = (days) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + days);
    setSelectedDate(current.toISOString().split("T")[0]);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = days[date.getDay()];
    return `${month}월 ${day}일 (${dayOfWeek})`;
  };

  // 달력 관련 함수들
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const changeCalendarMonth = (offset) => {
    const newDate = new Date(calendarMonth);
    newDate.setMonth(newDate.getMonth() + offset);
    setCalendarMonth(newDate);
  };

  const selectDateFromCalendar = (day) => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const selected = new Date(year, month, day);
    setSelectedDate(selected.toISOString().split("T")[0]);
    setShowCalendar(false);
  };

  const hasDataOnDate = (dateStr) => {
    const data = dailyData[dateStr];
    if (!data) return false;
    return (
      data.todos.length > 0 ||
      Object.keys(data.timeplan).length > 0 ||
      data.braindump
    );
  };

  const todayData = getTodayData();

  const CalendarModal = () => {
    const { daysInMonth, startingDayOfWeek, year, month } =
      getDaysInMonth(calendarMonth);
    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = new Date(year, month, day).toISOString().split("T")[0];
      const isSelected = dateStr === selectedDate;
      const isToday = dateStr === new Date().toISOString().split("T")[0];
      const hasData = hasDataOnDate(dateStr);

      days.push(
        <button
          key={day}
          onClick={() => selectDateFromCalendar(day)}
          className={`aspect-square flex flex-col items-center justify-center rounded-lg transition-all relative
            ${
              isSelected
                ? "bg-indigo-600 text-white font-bold"
                : isToday
                ? "bg-indigo-100 text-indigo-700 font-semibold"
                : "hover:bg-gray-100"
            }
          `}
        >
          <span>{day}</span>
          {hasData && !isSelected && (
            <div className="absolute bottom-1 w-1 h-1 bg-indigo-500 rounded-full" />
          )}
        </button>
      );
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => changeCalendarMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold">
              {year}년 {month + 1}월
            </h2>

            <button
              onClick={() => changeCalendarMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-semibold text-gray-600"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">{days}</div>

          <button
            onClick={() => setShowCalendar(false)}
            className="mt-4 w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
          >
            닫기
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* 동기부여 문구 */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-md p-4 mb-4 text-white text-center">
          <p className="text-lg font-semibold">{dailyQuote}</p>
        </div>

        {/* 헤더 - 날짜 선택 */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => changeDate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCalendar(true)}
                className="p-2 hover:bg-indigo-100 rounded-lg transition-colors"
              >
                <Calendar className="w-6 h-6 text-indigo-600" />
              </button>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800">
                  {formatDate(selectedDate)}
                </h1>
              </div>
            </div>

            <button
              onClick={() => changeDate(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* 왼쪽 컬럼 - TO DO LIST & BRAIN DUMP */}
          <div className="space-y-4">
            {/* TO DO LIST */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <List className="w-5 h-5 text-red-500" />
                  <h2 className="text-lg font-bold text-gray-800">
                    TO DO LIST
                  </h2>
                </div>
                <button
                  onClick={addTodo}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <Plus className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="space-y-2">
                {todayData.todos.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4">
                    할 일을 추가해보세요
                  </p>
                ) : (
                  todayData.todos.map((todo) => (
                    <div
                      key={todo.id}
                      className="flex items-center gap-2 group"
                    >
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={(e) =>
                          updateTodo(todo.id, { completed: e.target.checked })
                        }
                        className="w-5 h-5 rounded border-2 border-red-400 text-red-500 focus:ring-red-500"
                      />
                      <input
                        type="text"
                        value={todo.text}
                        onChange={(e) =>
                          updateTodo(todo.id, { text: e.target.value })
                        }
                        placeholder="할 일 입력"
                        className={`flex-1 px-2 py-1 border-b border-gray-200 outline-none focus:border-red-400 ${
                          todo.completed ? "line-through text-gray-400" : ""
                        }`}
                      />
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded transition-all"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* BRAIN DUMP */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-5 h-5 text-purple-500" />
                <h2 className="text-lg font-bold text-gray-800">BRAIN DUMP</h2>
              </div>
              <textarea
                value={todayData.braindump}
                onChange={(e) => updateBraindump(e.target.value)}
                placeholder="떠오르는 생각, 아이디어를 자유롭게 적어보세요..."
                className="w-full h-64 p-3 border border-gray-200 rounded-lg outline-none focus:border-purple-400 resize-none"
              />
            </div>
          </div>

          {/* 오른쪽 컬럼 - TIME PLAN */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-bold text-gray-800">TIME PLAN</h2>
              </div>

              <div className="grid grid-cols-1 gap-0 border border-gray-300 rounded-lg overflow-hidden">
                {timeSlots.map((time, index) => {
                  const hour = parseInt(time.split(":")[0]);
                  const isHourMark = time.endsWith(":00");
                  const isWorkHour = hour >= 9 && hour < 18;

                  return (
                    <div
                      key={time}
                      className={`grid grid-cols-12 ${
                        isHourMark
                          ? "border-t-2 border-gray-300"
                          : "border-t border-gray-200"
                      }`}
                    >
                      <div
                        className={`col-span-2 px-2 py-1 text-sm font-medium text-gray-600 flex items-center ${
                          isWorkHour ? "bg-blue-50" : "bg-gray-50"
                        }`}
                      >
                        {isHourMark && time}
                      </div>
                      <div
                        className={`col-span-10 ${
                          isWorkHour ? "bg-blue-50/30" : ""
                        }`}
                      >
                        <input
                          type="text"
                          value={todayData.timeplan[time] || ""}
                          onChange={(e) => updateTimeplan(time, e.target.value)}
                          placeholder={isHourMark ? "일정 입력" : ""}
                          className="w-full h-full px-2 py-1 text-sm outline-none bg-transparent focus:bg-yellow-50 transition-colors"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 하단 통계 */}
        <div className="mt-4 bg-white rounded-lg shadow-md p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">전체 할 일</p>
              <p className="text-2xl font-bold text-gray-800">
                {todayData.todos.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">완료</p>
              <p className="text-2xl font-bold text-green-600">
                {todayData.todos.filter((t) => t.completed).length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">남은 할 일</p>
              <p className="text-2xl font-bold text-red-600">
                {todayData.todos.filter((t) => !t.completed).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 달력 모달 */}
      {showCalendar && <CalendarModal />}
    </div>
  );
}
