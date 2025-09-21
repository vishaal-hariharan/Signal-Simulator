function Navbar() {
  return (
    <nav className="w-full bg-gray-800 shadow-md p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold tracking-wide">⚡ Signal Simulator</h1>
      <div className="space-x-4">
        <a href="#" className="hover:text-teal-400">Home</a>
        <a href="#" className="hover:text-teal-400">Features</a>
        <a href="#" className="hover:text-teal-400">About</a>
      </div>
    </nav>
  );
}

export default Navbar;
