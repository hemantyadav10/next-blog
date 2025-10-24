import jwt from 'jsonwebtoken';

// function to generate refresh and access token
export function generateTokens({
  _id,
  email,
  role,
}: {
  _id: string;
  email: string;
  role: string;
}) {
  const accessToken = jwt.sign(
    {
      userId: _id,
      email,
      role,
      type: 'access',
    },
    process.env.JWT_ACCESS_SECRET as string,
    { expiresIn: '1h' },
  );

  const refreshToken = jwt.sign(
    {
      userId: _id,
      type: 'refresh',
    },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: '7d' },
  );

  return { accessToken, refreshToken };
}
