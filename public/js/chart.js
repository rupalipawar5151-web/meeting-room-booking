// Time window shown on the chart: 8 AM to 8 PM
const CHART_START_MIN = 8 * 60;
const CHART_END_MIN = 20 * 60;
const CHART_SPAN_MIN = CHART_END_MIN - CHART_START_MIN;

// Convert "HH:MM:SS" or "HH:MM" into minutes since midnight
function toMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

// Format minutes back into a readable "h:mm AM/PM" label
function formatTime(mins) {
  let h = Math.floor(mins / 60);
  const m = mins % 60;
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m.toString().padStart(2, '0')} ${ampm}`;
}

// Load and render the chart for a given date
async function loadChart(date) {
  const chartArea = document.getElementById('chartArea');
  chartArea.innerHTML = '<p class="empty-state">Loading...</p>';

  try {
    const [roomsRes, bookingsRes] = await Promise.all([
      fetch('/api/bookings/rooms'),
      fetch(`/api/bookings?date=${date}`)
    ]);
    const rooms = await roomsRes.json();
    const bookings = await bookingsRes.json();

    chartArea.innerHTML = '';

    rooms.forEach(room => {
      const row = document.createElement('div');
      row.className = 'room-row';

      const nameEl = document.createElement('div');
      nameEl.className = 'room-name';
      nameEl.textContent = room.name;

      const timeline = document.createElement('div');
      timeline.className = 'timeline';

      // Find bookings that belong to this room
      const roomBookings = bookings.filter(b => b.room_id === room.id);

      roomBookings.forEach(b => {
        const start = toMinutes(b.start_time);
        const end = toMinutes(b.end_time);

        const leftPct = ((start - CHART_START_MIN) / CHART_SPAN_MIN) * 100;
        const widthPct = ((end - start) / CHART_SPAN_MIN) * 100;

        const slot = document.createElement('div');
        slot.className = 'slot';
        slot.style.left = `${leftPct}%`;
        slot.style.width = `${widthPct}%`;
        slot.title = `${b.booked_by} — ${b.purpose} (${formatTime(start)}–${formatTime(end)})`;
        slot.textContent = b.purpose;

        timeline.appendChild(slot);
      });

      row.appendChild(nameEl);
      row.appendChild(timeline);
      chartArea.appendChild(row);
    });

    renderHourRuler();

  } catch (err) {
    console.error(err);
    chartArea.innerHTML = '<p class="empty-state">Could not load the chart.</p>';
  }
}

// Draw the hour labels (8 AM, 9 AM, ... 8 PM) below the chart
function renderHourRuler() {
  const existing = document.querySelector('.hour-ruler');
  if (existing) existing.remove();

  const ruler = document.createElement('div');
  ruler.className = 'hour-ruler';

  const spacer = document.createElement('div');
  const track = document.createElement('div');
  track.className = 'ruler-track';

  for (let h = 8; h <= 20; h += 2) {
    const label = document.createElement('span');
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    label.textContent = `${hour12} ${ampm}`;
    track.appendChild(label);
  }

  ruler.appendChild(spacer);
  ruler.appendChild(track);
  document.getElementById('chartArea').after(ruler);
}