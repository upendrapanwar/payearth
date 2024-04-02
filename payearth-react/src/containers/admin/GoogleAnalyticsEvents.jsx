import React, { useEffect, useState } from 'react';

const GoogleAnalyticsEvents = () => {

    const [eventsData, setEventsData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // const propertyId = process.env.REACT_APP_MEASUREMENT_ID
                // 433479675
                const propertyId = 'G-TD3CF0CQ3Z';
                const apiSecret = process.env.REACT_APP_API_SECRET_KEY

                // const url = `https://www.googleanalytics.com/mp/collect?measurement_id=${propertyId}&api_secret=${apiSecret}`;

                // const response = await fetch(url);
                // const data = await response.json();

                // const count = data.viewCount;

                // console.log("Count", count)


                // Fetch events data from GA4
                const response = await fetch(`https://www.googleanalytics.com/mp/collect?measurement_id=${propertyId}&api_secret=${apiSecret}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        start_date: '2024-01-01',
                        end_date: '2024-03-29',
                        dimensions: ['event_name'],
                        metrics: [{ name: 'event_count' }],
                        order_bys: [{ metric: { metric_name: 'event_count' }, desc: true }],
                        limit: 10,
                    }),
                });

                if (response.ok) {
                    const eventData = await response.json();
                    console.log("eventData : ", eventData)
                    setEventsData(eventData);
                } else {
                    console.error('Failed to fetch events data');
                }
            } catch (error) {
                console.error('Error fetching events data:', error);
            }
        };

        fetchData();
    }, []);



    return (
        <div>
            <h2>Google Analytics Events Data</h2>
            <ul>
                {eventsData.map((event, index) => (
                    <li key={index}>
                        {event.event_name} - {event.event_count}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default GoogleAnalyticsEvents