// Load the room list into the form's dropdown
async function loadRoomOptions() {
  const res = await fetch('/api/bookings/rooms');
  const rooms = await res.json();

  const select = document.getElementById('roomId');
  select.innerHTML = '';
  rooms.forEach(room => {
    const option = document.createElement('option');
    option.value = room.id;
    option.textContent = room.name;
    select.appendChild(option);
  });
}

// Show a message under the form (success or error)
function showMessage(text, type) {
  const msg = document.getElementById('message');
  msg.textContent = text;
  msg.className = `message ${type}`;
}

// Handle the booking form submission
document.getElementById('bookingForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const bookingData = {
    roomId: document.getElementById('roomId').value,
    bookedBy: document.getElementById('bookedBy').value,
    purpose: document.getElementById('purpose').value,
    date: document.getElementById('date').value,
    startTime: document.getElementById('startTime').value,
    endTime: document.getElementById('endTime').value
  };

  try {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    const result = await res.json();

    if (!res.ok) {
      // Server rejected the booking (e.g. overlap conflict)
      showMessage(result.error, 'error');
      return;
    }

    showMessage('Room booked successfully.', 'success');
    document.getElementById('bookingForm').reset();

    // Refresh the chart so the new booking shows up immediately
    const chartDate = document.getElementById('chartDate').value;
    loadChart(chartDate);

  } catch (err) {
    console.error(err);
    showMessage('Something went wrong. Please try again.', 'error');
  }
});

// On page load: set today's date everywhere, load rooms, load today's chart
window.addEventListener('DOMContentLoaded', () => {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('date').value = today;
  document.getElementById('chartDate').value = today;

  loadRoomOptions();
  loadChart(today);

  // Reload the chart whenever the chart-date picker changes
  document.getElementById('chartDate').addEventListener('change', (e) => {
    loadChart(e.target.value);
  });
});