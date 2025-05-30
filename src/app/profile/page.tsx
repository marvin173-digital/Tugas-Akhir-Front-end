"use client";

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";

type UserData = {
  email: string;
  password: string;
  profilePic?: string; // base64 image string
};

const ProfilePage = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser: UserData = JSON.parse(storedUser);
      setUser(parsedUser);
      if (parsedUser.profilePic) setProfilePicPreview(parsedUser.profilePic);
    }
  }, []);

  // Handle ganti password
  const handlePasswordChange = (e: FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!user) {
      setMessage("User belum login.");
      return;
    }

    if (oldPassword !== user.password) {
      setMessage("Password lama salah.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Password baru dan konfirmasi tidak cocok.");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("Password baru minimal 6 karakter.");
      return;
    }

    const updatedUser = { ...user, password: newPassword };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage("Password berhasil diubah.");
  };

  const handleProfilePicChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result as string;
      setProfilePicPreview(base64String);

      if (user) {
        const updatedUser = { ...user, profilePic: base64String };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setMessage("Foto profil berhasil diperbarui.");
      }
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveProfilePic = () => {
    if (!user) return;
    const updatedUser = { ...user };
    delete updatedUser.profilePic;
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setProfilePicPreview(null);
    setMessage("Foto profil berhasil dihapus.");
  };

  const handleDeleteAccount = () => {
    if (
      confirm(
        "Apakah Anda yakin ingin menghapus akun? Semua data akan hilang dan Anda akan logout."
      )
    ) {
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");
      alert("Akun berhasil dihapus.");
      // redirect ke halaman login atau home
      window.location.href = "/login";
    }
  };

  return (
    <section className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Profil Saya</h1>

      <div className="mb-6">
        <label className="block mb-2 font-semibold">Email:</label>
        <p className="p-2 bg-gray-100 rounded border">{user?.email || "-"}</p>
      </div>

      <div className="mb-6">
        <label className="block mb-2 font-semibold">Password:</label>
        <div className="flex items-center gap-2">
          <input
            type={showPassword ? "text" : "password"}
            value={user?.password || ""}
            readOnly
            className="p-2 border rounded flex-grow bg-gray-100"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            {showPassword ? "Sembunyikan" : "Tampilkan"}
          </button>
        </div>
      </div>

      <div className="mb-6">
        <label className="block mb-2 font-semibold">Foto Profil</label>
        {profilePicPreview ? (
          <>
            <img
              src={profilePicPreview}
              alt="Foto Profil"
              className="w-32 h-32 object-cover rounded-full mb-2 border"
            />
            <button
              onClick={handleRemoveProfilePic}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Hapus Foto Profil
            </button>
          </>
        ) : (
          <>
            <div className="w-32 h-32 bg-gray-200 rounded-full mb-2 flex items-center justify-center text-gray-400">
              Belum ada foto
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              className="block"
            />
          </>
        )}
      </div>

      <form onSubmit={handlePasswordChange} className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Ganti Password</h2>

        <input
          type="password"
          placeholder="Password Lama"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="password"
          placeholder="Password Baru"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
          minLength={6}
        />

        <input
          type="password"
          placeholder="Konfirmasi Password Baru"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
          minLength={6}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Simpan Password Baru
        </button>
      </form>

      <button
        onClick={handleDeleteAccount}
        className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
      >
        Hapus Akun
      </button>

      {message && (
        <p
          className={`mt-4 text-center ${
            message.includes("berhasil") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </section>
  );
};

export default ProfilePage;
