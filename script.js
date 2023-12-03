        // Function to fetch and display scheduled feedings
        function getSchedules() {
            fetch('/get-schedules')
                .then(response => response.json())
                .then(schedules => {
                    // Sort the schedules array in ascending order
                    schedules.sort((a, b) => {
                        return new Date('1970/01/01 ' + a) - new Date('1970/01/01 ' + b);
                    });

                    const scheduleContainer = document.getElementById('scheduledTimes');
                    scheduleContainer.innerHTML = '';
                    schedules.forEach(time => {
                        const formattedTime = convertTo12HourFormat(time);
                        const div = document.createElement('div');
                        div.className = 'schedule';
                        div.textContent = formattedTime + ' ';
                        const deleteButton = document.createElement('button');
                        deleteButton.textContent = 'Delete';
                        deleteButton.className = 'delete-button';
                        deleteButton.onclick = () => deleteSchedule(time);
                        div.appendChild(deleteButton);
                        scheduleContainer.appendChild(div);
                    });
                });
        }

        // Function to convert 24-hour time to 12-hour format
        function convertTo12HourFormat(time) {
            const [hours, minutes] = time.split(':');
            const hour = parseInt(hours, 10);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const convertedHour = hour % 12 || 12;
            return `${convertedHour}:${minutes} ${ampm}`;
        }

        // Function to add a new schedule
        document.getElementById('addSchedule').onclick = () => {
            const time = document.getElementById('scheduleTime').value;
            fetch('/schedule-feeding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ time })
            }).then(() => getSchedules());
        };

        // Function to delete a schedule
        function deleteSchedule(time) {
            fetch('/delete-schedule', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ time })
            }).then(() => getSchedules());
        }

        // Function to fetch and display the last feeding time
        function getLastFeedingTime() {
            fetch('/last-feeding')
                .then(response => response.json())
                .then(data => {
                    if (data.lastFeeding === null || data.lastFeeding === '') {
                        document.getElementById('lastFeedingTime').textContent = 'No feedings yet';
                    } else {
                        const date = new Date(data.lastFeeding);
                        let formattedDate = '';
                        const today = new Date();
                        if (date.toDateString() === today.toDateString()) {
                            formattedDate = `Today at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
                        } else {
                            formattedDate = `${date.toLocaleDateString('en-US')} at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
                        }
                        document.getElementById('lastFeedingTime').textContent = formattedDate;
                    }
                });
        }

        // Function to trigger immediate feeding
        document.getElementById('feedNow').onclick = () => {
            fetch('/feed', { method: 'POST' })
                .then(() => getLastFeedingTime());
        };

        // Function to periodically update the last feeding time
        function updateLastFeedingPeriodically() {
            setInterval(() => {
                getLastFeedingTime();
            }, 1000); // Update every second
        }

        // Load scheduled feedings and the last feeding time on page load
        getSchedules();
        getLastFeedingTime();

        // Start the periodic update
        updateLastFeedingPeriodically();