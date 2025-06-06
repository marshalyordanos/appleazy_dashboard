import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AuthService from "./authService";

const initialState = {
  errorMessage: "",
  loading: false,
  isLoggedIn: false,
  isRegistered: false,
  user: null,
  profile: null,
  accessToken: null,
  profile: null,
  error: null,
};
// Create the login async thunk
export const loginAsync = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await AuthService.login(email, password);
      console.log(response, "response***********");

      return response;
    } catch (error) {
      // console.log(error.response.data.error, "error in login async");
      // initialState.errorMessage = error.response.data.error;
      return rejectWithValue(error.response.data);
    }
  }
);
// Create the login async thunk
export const getProfileAsync = createAsyncThunk(
  "auth/profile",
  async ({ id, api }, { rejectWithValue }) => {
    try {
      const response = await AuthService.getProfile(id, api);
      console.log(response, "response***********");

      return response;
    } catch (error) {
      // console.log(error.response.data.error, "error in login async");
      // initialState.errorMessage = error.response.data.error;
      return rejectWithValue(error.response.data);
    }
  }
);
export const updateProfileAsync = createAsyncThunk(
  "auth/updateprofile",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      console.log(data, "data in reducer");
      const response = await AuthService.updateProfile(id, data);
      console.log(response, "response***********");

      return response;
    } catch (error) {
      // console.log(error.response.data.error, "error in login async");
      // initialState.errorMessage = error.response.data.error;
      return rejectWithValue(error.response.data);
    }
  }
);

// Create the registration async thunk
export const registerAsync = createAsyncThunk(
  "auth/register",
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      console.log("inside register async");
      // console.log(phoneNumber, "phone");
      const response = await AuthService.register(username, email, password);
      console.log(response, "response***********");
      return response; // Include the server response in the payload
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
// Create the registration async thunk
export const logOutAsync = createAsyncThunk("auth/logout", async () => {
  try {
    console.log("inside register async");
    // console.log(phoneNumber, "phone");
    const response = await AuthService.logout();
    // if(resp)
    console.log(response, "response***********");
    return response; // Include the server response in the payload
  } catch (error) {
    return error;
  }
});
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    update_User: (state, action) => {
      try {
        console.log(action.payload, "action.payload in reducer");
        state.user = { ...state.user, ...action.payload };
        const data = JSON.parse(localStorage.getItem("persist:auth"));
        console.log(data, "222data in reducer");
        const d = {
          ...data,
          user: JSON.stringify({ ...state.user, ...action.payload }),
        };
        console.log(d, "data in reducer");

        localStorage.setItem("persist:auth", JSON.stringify(d));
      } catch (error) {
        console.log(error, "error in update_User");
      }
    },
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state) => {
      state.loading = false;
      state.isLoggedIn = true;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.profile = null;
      state.accessToken = null;
      localStorage.clear();
    },
    registerSuccess: (state) => {
      state.isRegistered = true;
    },
    updateAccessToken: (state, action) => {
      console.log(`updateAccessToken`, action.payload);
      state.accessToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        console.log(action.payload, "action.payload");
        state.loading = false;
        state.isLoggedIn = true;
        state.user = action.payload.data.user;
        state.accessToken = action.payload.data.token.active;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getProfileAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfileAsync.fulfilled, (state, action) => {
        console.log(action.payload, "action.payload");
        state.loading = false;
        state.profile = action.payload.data;
      })
      .addCase(getProfileAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isRegistered = true;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logOutAsync.fulfilled, (state, action) => {
        state.isLoggedIn = false;
        state.user = null;
        state.profile = null;
        state.accessToken = null;
        localStorage.clear();
      });
  },
});
export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
  registerSuccess,
  updateAccessToken,
  update_User,
} = authSlice.actions;
export default authSlice.reducer;
