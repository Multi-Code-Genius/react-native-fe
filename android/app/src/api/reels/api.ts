export const getReels = async height => {
  const fetchOptions = {
    method: 'GET',
    headers: {
      Authorization: `Xafp3Nd6LBXoosZfzVGlkHY6M71rYLhz4qKFAQJf8Q09mWRWZmiM8I5x`,
    },
  };
  const response = await fetch(
    `https://api.pexels.com/videos/popular?min_height=${height}&max_duration=30`,
    fetchOptions,
  );
  if (response.status == 200) {
    return response.json();
  } else {
    const text = await response.text();
    throw new Error(text);
  }
};
