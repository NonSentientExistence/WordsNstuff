import logo from '../assets/WordsLogo.png';

interface HeaderProp {
    title?: string;
}

const Header: React.FC<HeaderProp> = ({ title }) => {
  return (
    <header className="header">
      <img
        src={logo}
        alt="Logo"
        style={{ height: '120px', width: 'auto' }}
      />
      {title && (
        <span style={{ fontSize: '20px', fontWeight: 600, color: '#333' }}>
          {title}
        </span>
      )}
    </header>
  );
};

export default Header;