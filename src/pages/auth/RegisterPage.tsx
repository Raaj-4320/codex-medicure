import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../AuthContext';

interface Props {
role?: 'customer' | 'seller' | 'delivery';
}

const RegisterPage: React.FC<Props> = ({ role = 'customer' }) => {
const navigate = useNavigate();
const { register } = useAuth();

const [fullName, setFullName] = useState('');
const [phone, setPhone] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

const [error, setError] = useState('');
const [loading, setLoading] = useState(false);

const handleRegister = async (e: React.FormEvent) => {
e.preventDefault();
setError('');
setLoading(true);


try {
  await register(email, password, {
    displayName: fullName,
    role,
    phoneNumber: phone,
  });

  switch (role) {
    case 'seller': navigate('/seller'); break;
    case 'delivery': navigate('/delivery'); break;
    default: navigate('/dashboard');
  }

} catch (err: any) {
  setError(err?.message || 'Registration failed');
} finally {
  setLoading(false);
}


};

return ( <div className="min-h-screen flex justify-center items-center bg-gray-50"> <div className="bg-white p-8 rounded shadow w-full max-w-md">


    <div className="text-center mb-6">
      <ShieldCheck className="mx-auto w-10 h-10 text-emerald-600" />
      <h2 className="text-xl font-bold mt-2">
        {role} Registration
      </h2>
    </div>

    {error && <p className="text-red-500 text-sm">{error}</p>}

    <form onSubmit={handleRegister} className="space-y-4">

      <input
        placeholder="Full Name"
        required
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="w-full px-4 py-2 border rounded"
      />

      <input
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full px-4 py-2 border rounded"
      />

      <input
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 border rounded"
      />

      <input
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 border rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 text-white py-2 rounded flex justify-center"
      >
        {loading ? <Loader2 className="animate-spin" /> : 'Register'}
      </button>

    </form>

    <div className="text-center mt-4">
      <Link
        to={`/${role === 'customer' ? 'login' : role + '/login'}`}
        className="text-emerald-600"
      >
        Already have an account?
      </Link>
    </div>

  </div>
</div>


);
};

export default RegisterPage;
