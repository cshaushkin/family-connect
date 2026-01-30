import React, { useState } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

// Mock data for demo - replace with Firebase later
const MOCK_FAMILY = [
  { id: '1', name: 'You', location: [37.7749, -122.4194], mood: 'good', lastCheckIn: new Date(), needsSupport: false },
  { id: '2', name: 'Mom', location: [37.7849, -122.4094], mood: 'great', lastCheckIn: new Date(Date.now() - 3600000), needsSupport: false },
  { id: '3', name: 'Dad', location: [37.7649, -122.4294], mood: 'okay', lastCheckIn: new Date(Date.now() - 7200000), needsSupport: false },
  { id: '4', name: 'Sister', location: [37.7949, -122.3994], mood: 'needHug', lastCheckIn: new Date(Date.now() - 1800000), needsSupport: true }
];

const MOODS = {
  great: { emoji: '😊', label: 'Feeling Great', color: '#34C759' },
  good: { emoji: '🙂', label: 'Doing Good', color: '#5AC8FA' },
  okay: { emoji: '😐', label: 'Just Okay', color: '#FFCC00' },
  stressed: { emoji: '😰', label: 'Stressed', color: '#FF9500' },
  needHug: { emoji: '🤗', label: 'Need a Hug', color: '#FF2D55' },
  needSupport: { emoji: '💙', label: 'Need Support', color: '#007AFF' }
};

function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [familyMembers] = useState(MOCK_FAMILY);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentUserMood, setCurrentUserMood] = useState('good');
  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    // Try to sign in
    await signInWithEmailAndPassword(auth, email, password);
    setIsAuthenticated(true);
    setCurrentScreen('map');
  } catch (error) {
    // If sign in fails, try to create account
    if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        setIsAuthenticated(true);
        setCurrentScreen('map');
      } catch (createError) {
        alert('Error: ' + createError.message);
      }
    } else {
      alert('Error: ' + error.message);
    }
  }
};


  if (!isAuthenticated) {
    return <LoginScreen email={email} setEmail={setEmail} password={password} setPassword={setPassword} handleLogin={handleLogin} />;
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {currentScreen === 'map' && <MapScreen familyMembers={familyMembers} />}
        {currentScreen === 'checkin' && <CheckInScreen />}
        {currentScreen === 'mood' && <MoodScreen currentMood={currentUserMood} setCurrentMood={setCurrentUserMood} familyMembers={familyMembers} />}
        {currentScreen === 'settings' && <SettingsScreen />}
      </div>
      
      <nav style={styles.nav}>
        <NavButton icon="🗺️" label="Map" active={currentScreen === 'map'} onClick={() => setCurrentScreen('map')} />
        <NavButton icon="✅" label="Check In" active={currentScreen === 'checkin'} onClick={() => setCurrentScreen('checkin')} />
        <NavButton icon="❤️" label="How I Feel" active={currentScreen === 'mood'} onClick={() => setCurrentScreen('mood')} />
        <NavButton icon="⚙️" label="Settings" active={currentScreen === 'settings'} onClick={() => setCurrentScreen('settings')} />
      </nav>
    </div>
  );
}

function LoginScreen({ email, setEmail, password, setPassword, handleLogin }) {
  return (
    <div style={styles.loginContainer}>
      <div style={styles.loginBox}>
        <div style={styles.appIcon}>👨‍👩‍👧‍👦</div>
        <h1 style={styles.appTitle}>Family Connect</h1>
        <p style={styles.appSubtitle}>Stay connected with your loved ones</p>
        
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.btnPrimary}>Sign In</button>
          <button type="button" style={styles.btnSecondary}>Don't have an account? Sign Up</button>
        </form>

        <div style={styles.securityBadges}>
          <div style={styles.badge}>
            <span>🔒</span>
            <span>End-to-end encrypted</span>
          </div>
          <div style={styles.badge}>
            <span>👁️‍🗨️</span>
            <span>Family only - invite required</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MapScreen({ familyMembers }) {
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('🏠 Home');
  const [lastUpdated, setLastUpdated] = useState('5 min ago');

  const quickLocations = [
    { emoji: '🏠', label: 'Home' },
    { emoji: '💼', label: 'Work' },
    { emoji: '🏫', label: 'School' },
    { emoji: '🛒', label: 'Store' },
    { emoji: '☕', label: 'Coffee Shop' },
    { emoji: '🍽️', label: 'Restaurant' },
    { emoji: '🏋️', label: 'Gym' },
    { emoji: '🏥', label: 'Doctor' },
  ];

  const updateLocation = (location) => {
    setCurrentLocation(location);
    setLastUpdated('Just now');
    setShowLocationPicker(false);
    // In real app, this would update Firebase
  };

  return (
    <div style={styles.screenContainer}>
      <h2 style={styles.screenTitle}>Family Locations</h2>

      <div style={styles.card}>
        <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px'}}>
          <span style={{fontSize: '20px'}}>📍</span>
          <div style={{flex: 1}}>
            <div style={{fontWeight: '600'}}>Your Location</div>
            <div style={{fontSize: '12px', color: '#666'}}>{currentLocation} • Updated {lastUpdated}</div>
          </div>
        </div>
        <button 
          style={styles.btnPrimary} 
          onClick={() => setShowLocationPicker(!showLocationPicker)}
        >
          {showLocationPicker ? 'Cancel' : 'Update Location'}
        </button>

        {showLocationPicker && (
          <div style={{marginTop: '15px'}}>
            <div style={{fontSize: '14px', fontWeight: '600', marginBottom: '10px'}}>Quick Locations:</div>
            <div style={styles.quickLocationsGrid}>
              {quickLocations.map(loc => (
                <button
                  key={loc.label}
                  style={styles.quickLocationBtn}
                  onClick={() => updateLocation(`${loc.emoji} ${loc.label}`)}
                >
                  <div style={{fontSize: '24px'}}>{loc.emoji}</div>
                  <div style={{fontSize: '11px'}}>{loc.label}</div>
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Or type custom location..."
              style={{...styles.input, marginTop: '10px'}}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value) {
                  updateLocation(e.target.value);
                  e.target.value = '';
                }
              }}
            />
          </div>
        )}
      </div>

      <div style={styles.card}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
          <h3 style={styles.cardTitle}>Family</h3>
          <span style={{fontSize: '12px', color: '#666'}}>🌐 Manual Updates</span>
        </div>

        {familyMembers.map(member => (
          <div 
            key={member.id} 
            style={{
              ...styles.locationCard,
              ...(member.needsSupport ? {background: '#FFE5EC', border: '2px solid #FF2D55'} : {})
            }}
          >
            <div style={{...styles.memberAvatar, background: MOODS[member.mood].color}}>
              {member.name[0]}
            </div>
            <div style={{flex: 1}}>
              <div style={styles.memberName}>{member.name}</div>
              <div style={{fontSize: '14px', color: '#333', marginBottom: '2px'}}>
                {member.id === '1' ? currentLocation : 
                 member.id === '2' ? '☕ Coffee Shop' :
                 member.id === '3' ? '💼 Work' : '🏫 School'}
              </div>
              <div style={{fontSize: '12px', color: '#999'}}>
                Updated {member.id === '1' ? lastUpdated : 
                         member.id === '2' ? '20 min ago' :
                         member.id === '3' ? '1 hour ago' : '30 min ago'}
              </div>
            </div>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: MOODS[member.mood].color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              {MOODS[member.mood].emoji}
            </div>
          </div>
        ))}
      </div>

      <div style={styles.infoCard}>
        <div style={{display: 'flex', gap: '10px'}}>
          <span>💡</span>
          <div style={{fontSize: '13px', color: '#666'}}>
            <strong>Web App:</strong> Update your location manually when you arrive somewhere. 
            Perfect for staying connected without draining battery or needing background location access!
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckInScreen() {
  const [message, setMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const quickCheckIn = (msg) => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div style={styles.screenContainer}>
      <h2 style={styles.screenTitle}>Check In</h2>

      {showSuccess && (
        <div style={styles.successAlert}>✓ Check-in sent to your family!</div>
      )}

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Quick Check-In</h3>
        <div style={styles.quickActions}>
          <button style={styles.quickAction} onClick={() => quickCheckIn('All good!')}>
            <div style={styles.quickIcon}>👍</div>
            <div style={styles.quickLabel}>All Good</div>
          </button>
          <button style={styles.quickAction} onClick={() => quickCheckIn('Home safe')}>
            <div style={styles.quickIcon}>🏠</div>
            <div style={styles.quickLabel}>Home Safe</div>
          </button>
          <button style={styles.quickAction} onClick={() => quickCheckIn('On my way')}>
            <div style={styles.quickIcon}>🚗</div>
            <div style={styles.quickLabel}>On My Way</div>
          </button>
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Custom Message</h3>
        <input
          type="text"
          placeholder="What's happening?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={styles.input}
        />
        <button style={styles.btnPrimary} onClick={() => { quickCheckIn(message); setMessage(''); }}>
          Send Check-In
        </button>
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Recent Check-Ins</h3>
        <CheckInItem name="You" time="Just now" color="#5AC8FA" />
        <CheckInItem name="Mom" time="1 hour ago" color="#34C759" />
        <CheckInItem name="Dad" time="2 hours ago" color="#FF9500" />
      </div>
    </div>
  );
}

function CheckInItem({ name, time, color }) {
  return (
    <div style={styles.checkInItem}>
      <div style={{...styles.checkInAvatar, background: color}}>{name[0]}</div>
      <div style={styles.checkInInfo}>
        <div style={styles.checkInName}>{name}</div>
        <div style={styles.checkInTime}>{time}</div>
      </div>
      <div style={styles.checkMark}>✓</div>
    </div>
  );
}

function MoodScreen({ currentMood, setCurrentMood, familyMembers }) {
  const [showSuccess, setShowSuccess] = useState(false);

  const updateMood = (mood) => {
    setCurrentMood(mood);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div style={styles.screenContainer}>
      <h2 style={styles.screenTitle}>How I Feel</h2>

      {showSuccess && (
        <div style={styles.successAlert}>✓ Your family has been notified!</div>
      )}

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>How are you feeling?</h3>
        {Object.entries(MOODS).map(([key, mood]) => (
          <button
            key={key}
            style={{
              ...styles.moodOption,
              ...(currentMood === key ? styles.moodOptionSelected : {})
            }}
            onClick={() => updateMood(key)}
          >
            <span style={styles.moodEmoji}>{mood.emoji}</span>
            <span style={styles.moodLabel}>{mood.label}</span>
            {currentMood === key && <span style={styles.checkMark}>✓</span>}
          </button>
        ))}
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Family Status</h3>
        {familyMembers.filter(m => m.name !== 'You').map(member => (
          <div key={member.id} style={styles.familyMemberCard}>
            <div style={{...styles.memberAvatar, background: MOODS[member.mood].color}}>
              {member.name[0]}
            </div>
            <div style={styles.memberInfo}>
              <div style={styles.memberName}>{member.name}</div>
              <div style={styles.memberMood}>{MOODS[member.mood].emoji} {MOODS[member.mood].label}</div>
            </div>
            {member.needsSupport && (
              <button style={styles.sendLoveBtn}>
                <span>❤️</span>
                <span style={{fontSize: '11px'}}>Send Love</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsScreen() {
  const [shareLocation, setShareLocation] = useState(true);
  const [shareMood, setShareMood] = useState(true);
  const [allowCheckIns, setAllowCheckIns] = useState(true);

  return (
    <div style={styles.screenContainer}>
      <h2 style={styles.screenTitle}>Settings</h2>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Family Group</h3>
        <SettingsRow label="Group Name" value="The Smiths" />
        <SettingsRow label="Invite Code" value="ABC12XY8" highlight />
        <button style={styles.btnSecondary}>Manage Members</button>
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Privacy Settings</h3>
        <ToggleRow label="Share Location" value={shareLocation} onChange={setShareLocation} />
        <ToggleRow label="Share Mood Status" value={shareMood} onChange={setShareMood} />
        <ToggleRow label="Allow Check-Ins" value={allowCheckIns} onChange={setAllowCheckIns} />
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Account</h3>
        <SettingsRow label="Name" value="You" />
        <SettingsRow label="Email" value="you@example.com" />
        <button style={{...styles.btnSecondary, color: '#FF3B30', marginTop: '10px'}}>Sign Out</button>
      </div>
    </div>
  );
}

function SettingsRow({ label, value, highlight }) {
  return (
    <div style={styles.settingsRow}>
      <span style={styles.settingsLabel}>{label}</span>
      <span style={{...styles.settingsValue, ...(highlight ? {fontFamily: 'monospace', fontWeight: 'bold', color: '#007AFF'} : {})}}>
        {value}
      </span>
    </div>
  );
}

function ToggleRow({ label, value, onChange }) {
  return (
    <div style={styles.settingsRow}>
      <span style={styles.settingsLabel}>{label}</span>
      <button
        style={{...styles.toggle, ...(value ? styles.toggleActive : {})}}
        onClick={() => onChange(!value)}
      >
        <div style={{...styles.toggleThumb, ...(value ? {left: '22px'} : {})}}></div>
      </button>
    </div>
  );
}

function NavButton({ icon, label, active, onClick }) {
  return (
    <button style={{...styles.navButton, ...(active ? styles.navButtonActive : {})}} onClick={onClick}>
      <div style={styles.navIcon}>{icon}</div>
      <div style={styles.navLabel}>{label}</div>
    </button>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    paddingBottom: '80px',
  },
  loginContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  loginBox: {
    background: 'white',
    borderRadius: '20px',
    padding: '40px',
    maxWidth: '400px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  appIcon: {
    fontSize: '80px',
    textAlign: 'center',
    marginBottom: '20px',
  },
  appTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '10px',
  },
  appSubtitle: {
    color: '#666',
    textAlign: 'center',
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    fontSize: '16px',
    width: '100%',
    boxSizing: 'border-box',
  },
  btnPrimary: {
    padding: '15px',
    background: '#007AFF',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  btnSecondary: {
    padding: '15px',
    background: 'transparent',
    color: '#007AFF',
    border: 'none',
    fontSize: '14px',
    cursor: 'pointer',
  },
  securityBadges: {
    marginTop: '30px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: '#666',
  },
  screenContainer: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  screenTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '20px',
  },
  card: {
    background: 'white',
    borderRadius: '15px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '15px',
  },
  quickLocationsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
  },
  quickLocationBtn: {
    background: '#f0f0f0',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 8px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    textAlign: 'center',
  },
  locationCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '15px',
    background: '#f8f8f8',
    borderRadius: '12px',
    marginBottom: '12px',
    transition: 'all 0.3s',
  },
  infoCard: {
    background: '#E3F2FD',
    borderRadius: '12px',
    padding: '15px',
    marginTop: '20px',
    borderLeft: '4px solid #007AFF',
  },
  quickActions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
  },
  quickAction: {
    background: '#f0f0f0',
    border: 'none',
    borderRadius: '12px',
    padding: '15px 10px',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  quickIcon: {
    fontSize: '36px',
    marginBottom: '5px',
  },
  quickLabel: {
    fontSize: '11px',
    fontWeight: '500',
  },
  successAlert: {
    background: '#34C759',
    color: 'white',
    padding: '15px',
    borderRadius: '12px',
    marginBottom: '20px',
    textAlign: 'center',
    fontWeight: '600',
  },
  checkInItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: '#f8f8f8',
    borderRadius: '12px',
    marginBottom: '10px',
  },
  checkInAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  checkInInfo: {
    flex: 1,
  },
  checkInName: {
    fontWeight: '600',
    fontSize: '14px',
  },
  checkInTime: {
    fontSize: '12px',
    color: '#666',
  },
  checkMark: {
    color: '#34C759',
    fontSize: '20px',
  },
  moodOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    background: '#f0f0f0',
    border: 'none',
    borderRadius: '12px',
    marginBottom: '10px',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
    transition: 'all 0.3s',
  },
  moodOptionSelected: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
  },
  moodEmoji: {
    fontSize: '24px',
  },
  moodLabel: {
    flex: 1,
    fontSize: '16px',
    fontWeight: '500',
  },
  familyMemberCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    background: '#f8f8f8',
    borderRadius: '12px',
    marginBottom: '12px',
  },
  memberAvatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '20px',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontWeight: '600',
    fontSize: '16px',
    marginBottom: '3px',
  },
  memberMood: {
    fontSize: '14px',
    color: '#666',
  },
  sendLoveBtn: {
    background: '#FFE5EC',
    color: '#FF2D55',
    padding: '8px 15px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
  },
  settingsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #f0f0f0',
  },
  settingsLabel: {
    fontSize: '16px',
  },
  settingsValue: {
    color: '#666',
    fontSize: '14px',
  },
  toggle: {
    width: '50px',
    height: '30px',
    background: '#ccc',
    border: 'none',
    borderRadius: '15px',
    position: 'relative',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  toggleActive: {
    background: '#34C759',
  },
  toggleThumb: {
    width: '26px',
    height: '26px',
    background: 'white',
    borderRadius: '50%',
    position: 'absolute',
    top: '2px',
    left: '2px',
    transition: 'left 0.3s',
  },
  nav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'white',
    display: 'flex',
    justifyContent: 'space-around',
    padding: '10px 0 20px',
    borderTop: '1px solid #e0e0e0',
    boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
  },
  navButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '5px 15px',
    color: '#666',
    transition: 'all 0.3s',
  },
  navButtonActive: {
    color: '#007AFF',
  },
  navIcon: {
    fontSize: '24px',
    marginBottom: '3px',
  },
  navLabel: {
    fontSize: '10px',
  },
};

export default App;