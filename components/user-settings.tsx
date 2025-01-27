"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { authService, UserProfile, userService } from "@/services/api";

export default function UserSettings() {
  const [userData, setUserData] = useState<UserProfile>({
    email: "",
    username: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await authService.getCurrentUser();
      const { email, username } = response.data.data;
      setUserData({ email, username });
    } catch (error) {
      showError("Failed to load user data");
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await userService.updateProfile(userData);

      if (response.data.success) {
        showSuccess("Profile updated successfully!");
      }
    } catch (error) {
      showError("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await userService.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.data.success) {
        showSuccess("Password updated successfully!");
        resetPasswordFields();
      }
    } catch (error) {
      showError("Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  const resetPasswordFields = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const showSuccess = (message: string) => {
    iziToast.success({
      title: "Success",
      message,
      position: "topRight",
      timeout: 3000,
    });
  };

  const showError = (message: string) => {
    iziToast.error({
      title: "Error",
      message,
      position: "topRight",
      timeout: 5000,
    });
  };

  return (
      <Tabs defaultValue="account" className="space-y-4">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-white">Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    Email
                  </Label>
                  <Input
                      id="email"
                      type="email"
                      value={userData.email}
                      onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                      className="bg-white bg-opacity-20 text-white"
                      required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-white">
                    Username
                  </Label>
                  <Input
                      id="username"
                      type="text"
                      value={userData.username}
                      onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                      className="bg-white bg-opacity-20 text-white"
                      required
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-white">Security Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password" className="text-white">
                    Current Password
                  </Label>
                  <Input
                      id="current-password"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                          setPasswordData({ ...passwordData, currentPassword: e.target.value })
                      }
                      className="bg-white bg-opacity-20 text-white"
                      required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-white">
                    New Password
                  </Label>
                  <Input
                      id="new-password"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                          setPasswordData({ ...passwordData, newPassword: e.target.value })
                      }
                      className="bg-white bg-opacity-20 text-white"
                      required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-white">
                    Confirm New Password
                  </Label>
                  <Input
                      id="confirm-password"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                          setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                      }
                      className="bg-white bg-opacity-20 text-white"
                      required
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-white">Billing Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white">Payment Methods</h3>
                  <p className="text-sm text-gray-300">
                    You haven't added any payment methods yet.
                  </p>
                  <Button>Add Payment Method</Button>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white">Billing History</h3>
                  <p className="text-sm text-gray-300">
                    You don't have any billing history yet.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
  );
}
