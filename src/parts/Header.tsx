import logo from '../assets/WordsLogo.png';

interface HeaderProp {
    title?: string;
    subtitle?: string
}

function Header ({ title, subtitle }: HeaderProp) 
{
  return (
    <header className="site-header">
      <img src={logo} alt="WordsNstuff" />
      {title && <h1>{title}</h1>}
      {subtitle && <h2>{subtitle}</h2>}
    </header>
  );
};

export default Header;