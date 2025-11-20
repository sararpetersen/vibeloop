export function resetUserData() {
  // Keys to remove or reset
  const keysToRemove = [
    "vibeloop_onboarded",
    "vibeloop_user",
    "vibeloop_profile",
    "vibeloop_profile_avatar",
    "vibeloop_settings",
    "vibeloop_saved_dreams",
    "vibeloop_joined_loops",
    "vibeloop_recent_members",
    "vibeloop_upcoming_events",
    "vibeloop_event_attendees",
    "vibeloop_following",
    "vibeloop_rsvped_events",
    "vibeloop_debug",
    "vibeloop_saved_dreams",
    "vibeloop_profile_avatar",
  ];

  try {
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch (e) {
    // ignore
  }

  // Dispatch events so components can refresh if they listen
  try {
    window.dispatchEvent(new CustomEvent("vibeloop:reset"));
    window.dispatchEvent(new CustomEvent("vibeloop:joined_loops_changed"));
    window.dispatchEvent(new CustomEvent("vibeloop:data_changed"));
  } catch (e) {
    // ignore
  }
}
