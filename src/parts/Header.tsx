import logo from '../assets/WordsLogo.png';

interface HeaderProp {
    title?: string;
    subtitle?: string
}

function Header ({ title, subtitle }: HeaderProp) 
{
  return (
    <header style={{
       display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    }}>
      <img
        src={logo}
        alt="WordsNstuff"
        style={{ height: '120px', width: 'auto' }}
       /> 
      {title && (
        <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#3d3d3d' }}>
          {title}
        </h1>
      )}
      {subtitle && (
        <h2 style={{ fontSize: '16px', color: '#666' }}>
          {subtitle}
        </h2>
      )}
    </header>
  );
};

export default Header;