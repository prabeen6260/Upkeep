import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, AlertTriangle } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, addDays, isAfter, isBefore } from 'date-fns'

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(new Date())
    
    const [assets] = useState([
        {
            id: 1,
            name: 'Furnace',
            category: 'HVAC',
            lastMaintenance: '2024-01-15',
            nextMaintenance: '2024-04-15',
            interval: 3,
            status: 'upcoming'
        },
        {
            id: 2,
            name: 'Smoke Detectors',
            category: 'Safety',
            lastMaintenance: '2024-01-01',
            nextMaintenance: '2024-07-01',
            interval: 6,
            status: 'current'
        },
        {
            id: 3,
            name: 'Toyota Camry',
            category: 'Vehicle',
            lastMaintenance: '2024-02-01',
            nextMaintenance: '2024-05-01',
            interval: 3,
            status: 'overdue'
        }
    ])

    const [maintenanceEvents, setMaintenanceEvents] = useState([])

    useEffect(() => {
        // Generate maintenance events for the next 12 months
        const events = []
        const today = new Date()
        const endDate = addMonths(today, 12)
        
        assets.forEach(asset => {
            let nextDate = new Date(asset.nextMaintenance)
            
            while (nextDate <= endDate) {
                events.push({
                    id: `${asset.id}-${nextDate.getTime()}`,
                    assetId: asset.id,
                    assetName: asset.name,
                    assetCategory: asset.category,
                    date: nextDate,
                    status: nextDate < today ? 'overdue' : 
                           nextDate <= addDays(today, 7) ? 'current' : 'upcoming'
                })
                
                nextDate = addMonths(nextDate, asset.interval)
            }
        })
        
        setMaintenanceEvents(events)
    }, [assets])

    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const calendarStart = startOfMonth(monthStart)
    const calendarEnd = endOfMonth(monthEnd)
    
    const calendarDays = eachDayOfInterval({
        start: calendarStart,
        end: calendarEnd
    })

    const getEventsForDate = (date) => {
        return maintenanceEvents.filter(event => isSameDay(event.date, date))
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'overdue': return 'event-overdue'
            case 'current': return 'event-current'
            case 'upcoming': return 'event-upcoming'
            default: return 'event-upcoming'
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'overdue': return <AlertTriangle size={12} />
            case 'current': return <Clock size={12} />
            case 'upcoming': return <CalendarIcon size={12} />
            default: return <CalendarIcon size={12} />
        }
    }

    const navigateMonth = (direction) => {
        if (direction === 'prev') {
            setCurrentDate(subMonths(currentDate, 1))
        } else {
            setCurrentDate(addMonths(currentDate, 1))
        }
    }

    const selectedDateEvents = getEventsForDate(selectedDate)

    return (
        <div className="calendar-page">
            <div className="page-header">
                <h1>Maintenance Calendar</h1>
                <div className="calendar-nav">
                    <button 
                        className="btn btn-outline"
                        onClick={() => navigateMonth('prev')}
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <h2>{format(currentDate, 'MMMM yyyy')}</h2>
                    <button 
                        className="btn btn-outline"
                        onClick={() => navigateMonth('next')}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            <div className="calendar-container">
                <div className="calendar-grid">
                    <div className="calendar-header">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="calendar-day-header">{day}</div>
                        ))}
                    </div>
                    
                    <div className="calendar-body">
                        {calendarDays.map(day => {
                            const isCurrentMonth = isSameMonth(day, currentDate)
                            const isSelected = isSameDay(day, selectedDate)
                            const dayEvents = getEventsForDate(day)
                            
                            return (
                                <div
                                    key={day.toISOString()}
                                    className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isSelected ? 'selected' : ''}`}
                                    onClick={() => setSelectedDate(day)}
                                >
                                    <div className="day-number">{format(day, 'd')}</div>
                                    <div className="day-events">
                                        {dayEvents.slice(0, 3).map(event => (
                                            <div 
                                                key={event.id} 
                                                className={`event-dot ${getStatusColor(event.status)}`}
                                                title={`${event.assetName} - ${event.assetCategory}`}
                                            >
                                                {getStatusIcon(event.status)}
                                            </div>
                                        ))}
                                        {dayEvents.length > 3 && (
                                            <div className="more-events">+{dayEvents.length - 3}</div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="calendar-sidebar">
                    <div className="selected-date-info">
                        <h3>{format(selectedDate, 'EEEE, MMMM d, yyyy')}</h3>
                        
                        {selectedDateEvents.length > 0 ? (
                            <div className="date-events">
                                {selectedDateEvents.map(event => (
                                    <div key={event.id} className={`event-item ${getStatusColor(event.status)}`}>
                                        <div className="event-icon">
                                            {getStatusIcon(event.status)}
                                        </div>
                                        <div className="event-details">
                                            <h4>{event.assetName}</h4>
                                            <p>{event.assetCategory}</p>
                                        </div>
                                        <div className="event-status">
                                            <span className={`status-badge ${getStatusColor(event.status)}`}>
                                                {event.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-events">
                                <CalendarIcon size={32} />
                                <p>No maintenance scheduled for this date</p>
                            </div>
                        )}
                    </div>

                    <div className="calendar-legend">
                        <h4>Legend</h4>
                        <div className="legend-items">
                            <div className="legend-item">
                                <div className="legend-dot event-overdue"></div>
                                <span>Overdue</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-dot event-current"></div>
                                <span>Due Soon</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-dot event-upcoming"></div>
                                <span>Upcoming</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
