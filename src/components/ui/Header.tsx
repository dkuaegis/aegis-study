function Header() {
    return (
        <header className="flex items-center bg-white px-8 py-4">
            <div className="flex items-center gap-3">
                <img
                    src="aegis-logo-2500w-opti.png"
                    alt="Aegis Logo"
                    width={56}
                    height={56}
                    className="rounded-full"
                />
                <h1 className="font-bold text-2xl text-black">Aegis</h1>
            </div>
        </header>
    );
}

export default Header;