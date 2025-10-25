import { useState } from 'react'
import { Bell, Palette, Download, Database, Calendar } from 'lucide-react'

export default function Settings() {
    const [settings, setSettings] = useState({
        notifications: {
            email: true,
            push: false,
            sms: false,
            reminderDays: 7,
            overdueAlerts: true,
            weeklyDigest: true
        },
        preferences: {
            theme: 'light',
            dateFormat: 'MM/dd/yyyy',
            timeFormat: '12h',
            defaultView: 'dashboard',
            itemsPerPage: 10
        },
        maintenance: {
            autoSchedule: false,
            defaultInterval: 3,
            reminderBuffer: 7,
            skipWeekends: false
        }
    })

    const handleSettingChange = (section, key, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value
            }
        }))
    }

    const handleExport = () => {
        const data = {
            assets: [],
            maintenanceHistory: [],
            settings: settings,
            exportDate: new Date().toISOString()
        }
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `upkeep-backup-${new Date().toISOString().split('T')[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
    }

    const handleImport = (event) => {
        const file = event.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result)
                    if (data.settings) {
                        setSettings(data.settings)
                    }
                    alert('Settings imported successfully!')
                } catch (error) {
                    alert('Error importing file. Please check the file format.')
                }
            }
            reader.readAsText(file)
        }
    }

    const resetToDefaults = () => {
        if (confirm('Are you sure you want to reset all settings to defaults? This action cannot be undone.')) {
            setSettings({
                notifications: {
                    email: true,
                    push: false,
                    sms: false,
                    reminderDays: 7,
                    overdueAlerts: true,
                    weeklyDigest: true
                },
                preferences: {
                    theme: 'light',
                    dateFormat: 'MM/dd/yyyy',
                    timeFormat: '12h',
                    defaultView: 'dashboard',
                    itemsPerPage: 10
                },
                maintenance: {
                    autoSchedule: false,
                    defaultInterval: 3,
                    reminderBuffer: 7,
                    skipWeekends: false
                }
            })
        }
    }

    return (
        <div className="settings-page">
            <div className="page-header">
                <h1>Application Settings</h1>
                <p>Configure your Upkeep application preferences and maintenance settings</p>
            </div>

            <div className="settings-container">
                <div className="settings-section">
                    <div className="section-header">
                        <Bell size={20} />
                        <h2>Notifications</h2>
                    </div>
                    
                    <div className="settings-form">
                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={settings.notifications.email}
                                    onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                                />
                                <span>Email notifications</span>
                            </label>
                        </div>
                        
                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={settings.notifications.push}
                                    onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                                />
                                <span>Push notifications</span>
                            </label>
                        </div>
                        
                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={settings.notifications.sms}
                                    onChange={(e) => handleSettingChange('notifications', 'sms', e.target.checked)}
                                />
                                <span>SMS notifications</span>
                            </label>
                        </div>

                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={settings.notifications.overdueAlerts}
                                    onChange={(e) => handleSettingChange('notifications', 'overdueAlerts', e.target.checked)}
                                />
                                <span>Overdue maintenance alerts</span>
                            </label>
                        </div>

                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={settings.notifications.weeklyDigest}
                                    onChange={(e) => handleSettingChange('notifications', 'weeklyDigest', e.target.checked)}
                                />
                                <span>Weekly maintenance digest</span>
                            </label>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="reminderDays">Reminder Days Before Due</label>
                            <select
                                id="reminderDays"
                                value={settings.notifications.reminderDays}
                                onChange={(e) => handleSettingChange('notifications', 'reminderDays', parseInt(e.target.value))}
                            >
                                <option value={1}>1 day</option>
                                <option value={3}>3 days</option>
                                <option value={7}>7 days</option>
                                <option value={14}>14 days</option>
                                <option value={30}>30 days</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="settings-section">
                    <div className="section-header">
                        <Calendar size={20} />
                        <h2>Maintenance Settings</h2>
                    </div>
                    
                    <div className="settings-form">
                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={settings.maintenance.autoSchedule}
                                    onChange={(e) => handleSettingChange('maintenance', 'autoSchedule', e.target.checked)}
                                />
                                <span>Auto-schedule maintenance tasks</span>
                            </label>
                        </div>

                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={settings.maintenance.skipWeekends}
                                    onChange={(e) => handleSettingChange('maintenance', 'skipWeekends', e.target.checked)}
                                />
                                <span>Skip weekends for maintenance scheduling</span>
                            </label>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="defaultInterval">Default Maintenance Interval (months)</label>
                            <select
                                id="defaultInterval"
                                value={settings.maintenance.defaultInterval}
                                onChange={(e) => handleSettingChange('maintenance', 'defaultInterval', parseInt(e.target.value))}
                            >
                                <option value={1}>1 month</option>
                                <option value={3}>3 months</option>
                                <option value={6}>6 months</option>
                                <option value={12}>12 months</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="reminderBuffer">Reminder Buffer Days</label>
                            <select
                                id="reminderBuffer"
                                value={settings.maintenance.reminderBuffer}
                                onChange={(e) => handleSettingChange('maintenance', 'reminderBuffer', parseInt(e.target.value))}
                            >
                                <option value={1}>1 day</option>
                                <option value={3}>3 days</option>
                                <option value={7}>7 days</option>
                                <option value={14}>14 days</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="settings-section">
                    <div className="section-header">
                        <Palette size={20} />
                        <h2>Display Preferences</h2>
                    </div>
                    
                    <div className="settings-form">
                        <div className="form-group">
                            <label htmlFor="theme">Theme</label>
                            <select
                                id="theme"
                                value={settings.preferences.theme}
                                onChange={(e) => handleSettingChange('preferences', 'theme', e.target.value)}
                            >
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                                <option value="auto">Auto</option>
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="dateFormat">Date Format</label>
                            <select
                                id="dateFormat"
                                value={settings.preferences.dateFormat}
                                onChange={(e) => handleSettingChange('preferences', 'dateFormat', e.target.value)}
                            >
                                <option value="MM/dd/yyyy">MM/DD/YYYY</option>
                                <option value="dd/MM/yyyy">DD/MM/YYYY</option>
                                <option value="yyyy-MM-dd">YYYY-MM-DD</option>
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="timeFormat">Time Format</label>
                            <select
                                id="timeFormat"
                                value={settings.preferences.timeFormat}
                                onChange={(e) => handleSettingChange('preferences', 'timeFormat', e.target.value)}
                            >
                                <option value="12h">12-hour (AM/PM)</option>
                                <option value="24h">24-hour</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="defaultView">Default Dashboard View</label>
                            <select
                                id="defaultView"
                                value={settings.preferences.defaultView}
                                onChange={(e) => handleSettingChange('preferences', 'defaultView', e.target.value)}
                            >
                                <option value="dashboard">Dashboard</option>
                                <option value="calendar">Calendar</option>
                                <option value="assets">Assets</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="itemsPerPage">Items Per Page</label>
                            <select
                                id="itemsPerPage"
                                value={settings.preferences.itemsPerPage}
                                onChange={(e) => handleSettingChange('preferences', 'itemsPerPage', parseInt(e.target.value))}
                            >
                                <option value={5}>5 items</option>
                                <option value={10}>10 items</option>
                                <option value={25}>25 items</option>
                                <option value={50}>50 items</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="settings-section">
                    <div className="section-header">
                        <Database size={20} />
                        <h2>Data Management</h2>
                    </div>
                    
                    <div className="settings-form">
                        <div className="form-group">
                            <label>Export Data</label>
                            <p className="form-description">Download a backup of your assets, maintenance history, and settings</p>
                            <button className="btn btn-outline" onClick={handleExport}>
                                <Download size={16} />
                                Export Backup
                            </button>
                        </div>
                        
                        <div className="form-group">
                            <label>Import Data</label>
                            <p className="form-description">Restore from a previous backup</p>
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleImport}
                                className="file-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Clear All Data</label>
                            <p className="form-description">Permanently delete all assets and maintenance records</p>
                            <button className="btn btn-danger">
                                <Database size={16} />
                                Clear All Data
                            </button>
                        </div>
                    </div>
                </div>

                <div className="settings-actions">
                    <button className="btn btn-primary">Save Changes</button>
                    <button className="btn btn-outline" onClick={resetToDefaults}>Reset to Defaults</button>
                </div>
            </div>
        </div>
    )
}