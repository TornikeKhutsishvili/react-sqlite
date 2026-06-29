import { Suspense, useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "./store";
import AppRoutes from "./features/routes/AppRoutes";
import { loadCurrentUser } from "./store/auth/auth.thunks";
import { sessionService } from "./core/services/session.services";

const App = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (sessionService.getToken()) dispatch(loadCurrentUser());
  }, [dispatch]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppRoutes />
    </Suspense>
  )
}

export default App
