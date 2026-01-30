import React from 'react';

   function App() {
     return (
       <div style={{
         minHeight: '100vh',
         background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center',
         color: 'white',
         fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
       }}>
         <div style={{
           textAlign: 'center',
           padding: '40px'
         }}>
           <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>👨‍👩‍👧‍👦</h1>
           <h2 style={{ fontSize: '32px', marginBottom: '10px' }}>Family Connect</h2>
           <p style={{ fontSize: '18px' }}>Stay connected with your loved ones</p>
         </div>
       </div>
     );
   }

   export default App;