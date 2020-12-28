package com.bridgeconn.vachango;
import android.app.Application;
import com.facebook.react.ReactApplication;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
// import com.github.yamill.orientation.OrientationPackage; 
// import com.reactnativecommunity.netinfo.NetInfoPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
// import com.facebook.CallbackManager;

import com.brentvatne.react.ReactVideoPackage;
import io.realm.react.RealmReactPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.rnfs.RNFSPackage;
import io.invertase.firebase.RNFirebasePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.storage.RNFirebaseStoragePackage;
import io.invertase.firebase.firestore.RNFirebaseFirestorePackage;
import io.invertase.firebase.database.RNFirebaseDatabasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import com.github.alinz.reactnativewebviewbridge.WebViewBridgePackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.reactnativecommunity.toolbarandroid.ReactToolbarPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import io.xogus.reactnative.versioncheck.RNVersionCheckPackage;
// import com.imagepicker.ImagePickerPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
  // private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  // protected static CallbackManager getCallbackManager() {
  //   return mCallbackManager;
  // }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          // new OrientationPackage(),
            new RNGestureHandlerPackage(),
            new ReanimatedPackage(),
            new SplashScreenReactPackage(),
            // new NetInfoPackage(),
            new RNGoogleSigninPackage(),
            new ReactVideoPackage(),
            new RealmReactPackage(),
            new VectorIconsPackage(),
            new RNFSPackage(),
            new AsyncStoragePackage(),
            new RNFirebasePackage(),
            new RNFirebaseAuthPackage(),
            new RNFirebaseStoragePackage(),
            new RNFirebaseFirestorePackage(),
            new RNFirebaseDatabasePackage(),
            new RNFirebaseMessagingPackage(),
            new RNFirebaseNotificationsPackage(),
            new WebViewBridgePackage(),
            new FBSDKPackage(),
            new ReactToolbarPackage(),
            new RNCWebViewPackage(),
            new RNVersionCheckPackage()   
            // new ImagePickerPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
