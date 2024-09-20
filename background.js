chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "setReminder") {
      const reminder = request.reminder;
      chrome.alarms.create(reminder.text, {when: reminder.time});
    }
  });
  
  chrome.alarms.onAlarm.addListener((alarm) => {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'Web Reminder',
      message: alarm.name
    });
  });