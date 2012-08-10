//
//  BrowserAppAppDelegate.h
//  Web
//
//  Created by Gian Biondi on 8/10/12.
//  Copyright (c) 2012 Gian Biondi. All rights reserved.
//

#import <UIKit/UIKit.h>

@class BrowserAppViewController;

@interface BrowserAppAppDelegate : UIResponder <UIApplicationDelegate>

@property (strong, nonatomic) UIWindow *window;

@property (strong, nonatomic) BrowserAppViewController *viewController;

@end
