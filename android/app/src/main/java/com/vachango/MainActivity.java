package com.bridgeconn.vachango;
import android.os.Bundle;
import android.content.Intent;
import android.content.res.Configuration; // <--- 
// import com.imagepicker.permissions.OnImagePickerPermissionsCallback; // <- add this import
// import com.facebook.react.modules.core.PermissionListener; // <- add this import


import org.devio.rn.splashscreen.SplashScreen;
import com.facebook.react.ReactActivity;

import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

public class MainActivity extends ReactActivity {
  // private PermissionListener listener;

  // @Override
  // public void setPermissionListener(PermissionListener listener)
  // {
  //   this.listener = listener;
  // }

  // @Override
  // public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults)
  // {
  //   if (listener != null)
  //   {
  //     listener.onRequestPermissionsResult(requestCode, permissions, grantResults);
  //   }
  //   super.onRequestPermissionsResult(requestCode, permissions, grantResults);
  // }
//  @Override
//     public void onActivityResult(int requestCode, int resultCode, Intent data) {
//         super.onActivityResult(requestCode, resultCode, data);
//         MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
//     }
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);  // here
        super.onCreate(savedInstanceState);
    }
    @Override
    protected String getMainComponentName() {
        return "VachanGo";
    }
    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
      return new ReactActivityDelegate(this, getMainComponentName()) {
        @Override
        protected ReactRootView createRootView() {
         return new RNGestureHandlerEnabledRootView(MainActivity.this);
        }
      };
    }


    @Override
      public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        Intent intent = new Intent("onConfigurationChanged");
        intent.putExtra("newConfig", newConfig);
        this.sendBroadcast(intent);
    }
}
