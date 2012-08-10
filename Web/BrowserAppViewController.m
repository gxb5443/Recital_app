//
//  BrowserAppViewController.m
//  Web
//
//  Created by Gian Biondi on 8/10/12.
//  Copyright (c) 2012 Gian Biondi. All rights reserved.
//

#import "BrowserAppViewController.h"

@interface BrowserAppViewController ()

@end

@implementation BrowserAppViewController
@synthesize webView;

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view, typically from a nib.
    [self.webView loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:@"http://gianbiondi.com/vex.html"]] ];
}

- (void)viewDidUnload
{
    [self setWebView:nil];
    [super viewDidUnload];
    // Release any retained subviews of the main view.
}

- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation
{
    return YES;
}

@end
