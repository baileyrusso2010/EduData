<template>
  <v-container class="pa-6">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 mb-6">Support & Help</h1>
      </v-col>
    </v-row>

    <!-- Contact Support Section -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="mb-6">
          <v-card-title class="text-h5 primary white--text">
            <v-icon class="mr-2">mdi-help-circle</v-icon>
            Contact Support
          </v-card-title>
          <v-card-text class="pa-4">
            <p class="mb-4">Need help? We're here to assist you!</p>

            <v-list dense>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-email</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Email Support</v-list-item-title>
                  <v-list-item-subtitle>support@edudata.com</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-phone</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Phone Support</v-list-item-title>
                  <v-list-item-subtitle>1-800-EDU-DATA (338-3282)</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-clock</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Business Hours</v-list-item-title>
                  <v-list-item-subtitle>Mon-Fri: 8:00 AM - 6:00 PM EST</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>

            <v-btn color="primary" class="mt-4" block>
              <v-icon class="mr-2">mdi-ticket</v-icon>
              Submit Support Ticket
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Quick Links Section -->
      <v-col cols="12" md="6">
        <v-card class="mb-6">
          <v-card-title class="text-h5 success white--text">
            <v-icon class="mr-2">mdi-link</v-icon>
            Quick Links
          </v-card-title>
          <v-card-text class="pa-4">
            <v-list dense>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-book-open</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>User Guide</v-list-item-title>
                  <v-list-item-subtitle>Complete documentation</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-video</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Video Tutorials</v-list-item-title>
                  <v-list-item-subtitle>Step-by-step guides</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-frequently-asked-questions</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>FAQ</v-list-item-title>
                  <v-list-item-subtitle>Common questions answered</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-update</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Release Notes</v-list-item-title>
                  <v-list-item-subtitle>Latest updates & features</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Debugging Information Section -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h5 warning white--text">
            <v-icon class="mr-2">mdi-bug</v-icon>
            Debugging & Troubleshooting
          </v-card-title>
          <v-card-text class="pa-4">
            <v-expansion-panels variant="accordion">
              <!-- Common Issues -->
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <v-icon class="mr-2">mdi-alert-circle</v-icon>
                  Common Issues & Solutions
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-list dense>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title class="font-weight-bold"
                          >File Upload Issues</v-list-item-title
                        >
                        <v-list-item-subtitle>
                          • Ensure file is in CSV or Excel format<br />
                          • Check file size (max 10MB)<br />
                          • Verify column headers match expected format
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>

                    <v-divider class="my-2"></v-divider>

                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title class="font-weight-bold"
                          >Data Not Loading</v-list-item-title
                        >
                        <v-list-item-subtitle>
                          • Refresh the page (F5 or Ctrl+R)<br />
                          • Clear browser cache<br />
                          • Check internet connection<br />
                          • Try a different browser
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>

                    <v-divider class="my-2"></v-divider>

                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title class="font-weight-bold"
                          >Charts Not Displaying</v-list-item-title
                        >
                        <v-list-item-subtitle>
                          • Disable browser ad-blockers<br />
                          • Enable JavaScript in browser settings<br />
                          • Update to latest browser version
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-expansion-panel-text>
              </v-expansion-panel>

              <!-- Browser Console -->
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <v-icon class="mr-2">mdi-console</v-icon>
                  How to Check Browser Console
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div class="mb-4">
                    <h4 class="mb-2">Step 1: Open Developer Tools</h4>
                    <div class="ml-4">
                      <v-chip class="mr-2 mb-2" small color="primary">Windows/Linux</v-chip>
                      <code class="ml-2">F12</code> or <code>Ctrl + Shift + I</code>
                      <br />
                      <v-chip class="mr-2 mt-2" small color="primary">Mac</v-chip>
                      <code class="ml-2">Cmd + Option + I</code>
                    </div>
                  </div>

                  <div class="mb-4">
                    <h4 class="mb-2">Step 2: Navigate to Console Tab</h4>
                    <div class="ml-4">Click on the "Console" tab in the developer tools panel</div>
                  </div>

                  <div class="mb-4">
                    <h4 class="mb-2">Step 3: Look for Errors</h4>
                    <div class="ml-4">
                      Red text indicates errors. Take a screenshot or copy the error message when
                      contacting support.
                    </div>
                  </div>

                  <v-alert type="info" class="mt-3">
                    <strong>Tip:</strong> Keep the console open while using the application to catch
                    errors as they happen.
                  </v-alert>
                </v-expansion-panel-text>
              </v-expansion-panel>

              <!-- System Information -->
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <v-icon class="mr-2">mdi-information</v-icon>
                  System Information for Support
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <p class="mb-3">
                    When contacting support, please provide the following information:
                  </p>

                  <v-card outlined class="pa-3 mb-3">
                    <v-card-subtitle class="text-h6 mb-2">Your System Info:</v-card-subtitle>
                    <v-simple-table dense>
                      <tbody>
                        <tr>
                          <td class="font-weight-bold">Browser:</td>
                          <td>{{ systemInfo.browser }}</td>
                        </tr>
                        <tr>
                          <td class="font-weight-bold">Version:</td>
                          <td>{{ systemInfo.version }}</td>
                        </tr>
                        <tr>
                          <td class="font-weight-bold">Platform:</td>
                          <td>{{ systemInfo.platform }}</td>
                        </tr>
                        <tr>
                          <td class="font-weight-bold">Screen Resolution:</td>
                          <td>{{ systemInfo.screenResolution }}</td>
                        </tr>
                        <tr>
                          <td class="font-weight-bold">Timestamp:</td>
                          <td>{{ systemInfo.timestamp }}</td>
                        </tr>
                      </tbody>
                    </v-simple-table>

                    <v-btn color="primary" small class="mt-3" @click="copySystemInfo">
                      <v-icon class="mr-1">mdi-content-copy</v-icon>
                      Copy System Info
                    </v-btn>
                  </v-card>

                  <v-alert type="info" class="mt-3">
                    <strong>Additional helpful information:</strong><br />
                    • Steps to reproduce the issue<br />
                    • Error messages (if any)<br />
                    • Screenshots of the problem<br />
                    • What you were trying to accomplish
                  </v-alert>
                </v-expansion-panel-text>
              </v-expansion-panel>

              <!-- Network Issues -->
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <v-icon class="mr-2">mdi-wifi-off</v-icon>
                  Network & Connectivity Issues
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-list dense>
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon>mdi-check-circle</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>Check Internet Connection</v-list-item-title>
                        <v-list-item-subtitle
                          >Ensure you have a stable internet connection</v-list-item-subtitle
                        >
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon>mdi-shield-check</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>Firewall & Security</v-list-item-title>
                        <v-list-item-subtitle
                          >Check if corporate firewall is blocking the
                          application</v-list-item-subtitle
                        >
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon>mdi-dns</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>DNS Issues</v-list-item-title>
                        <v-list-item-subtitle
                          >Try accessing from a different network or using mobile
                          data</v-list-item-subtitle
                        >
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-expansion-panel-text>
              </v-expansion-panel>

              <!-- Performance Issues -->
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <v-icon class="mr-2">mdi-speedometer</v-icon>
                  Performance Issues
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-list dense>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title class="font-weight-bold"
                          >Application Running Slowly</v-list-item-title
                        >
                        <v-list-item-subtitle>
                          • Close unnecessary browser tabs<br />
                          • Clear browser cache and cookies<br />
                          • Restart your browser<br />
                          • Check available RAM and CPU usage
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>

                    <v-divider class="my-2"></v-divider>

                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title class="font-weight-bold"
                          >Large File Processing</v-list-item-title
                        >
                        <v-list-item-subtitle>
                          • Break large files into smaller chunks<br />
                          • Process data during off-peak hours<br />
                          • Ensure stable internet connection for uploads
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface SystemInfo {
  browser: string
  version: string
  platform: string
  screenResolution: string
  timestamp: string
}

const systemInfo = ref<SystemInfo>({
  browser: '',
  version: '',
  platform: '',
  screenResolution: '',
  timestamp: '',
})

onMounted(() => {
  // Detect browser and system information
  const navigator = window.navigator
  const userAgent = navigator.userAgent

  // Simple browser detection
  let browser = 'Unknown'
  let version = 'Unknown'

  if (userAgent.includes('Chrome') && !userAgent.includes('Edge')) {
    browser = 'Chrome'
    const match = userAgent.match(/Chrome\/(\d+\.\d+)/)
    version = match ? match[1] : 'Unknown'
  } else if (userAgent.includes('Firefox')) {
    browser = 'Firefox'
    const match = userAgent.match(/Firefox\/(\d+\.\d+)/)
    version = match ? match[1] : 'Unknown'
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browser = 'Safari'
    const match = userAgent.match(/Version\/(\d+\.\d+)/)
    version = match ? match[1] : 'Unknown'
  } else if (userAgent.includes('Edge')) {
    browser = 'Edge'
    const match = userAgent.match(/Edge\/(\d+\.\d+)/)
    version = match ? match[1] : 'Unknown'
  }

  systemInfo.value = {
    browser,
    version,
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    timestamp: new Date().toISOString(),
  }
})

const copySystemInfo = async () => {
  const info = `
Browser: ${systemInfo.value.browser}
Version: ${systemInfo.value.version}
Platform: ${systemInfo.value.platform}
Screen Resolution: ${systemInfo.value.screenResolution}
Timestamp: ${systemInfo.value.timestamp}
User Agent: ${navigator.userAgent}
  `.trim()

  try {
    await navigator.clipboard.writeText(info)
    // You could add a snackbar notification here
    console.log('System info copied to clipboard')
  } catch (err) {
    console.error('Failed to copy system info:', err)
  }
}
</script>

<style scoped>
code {
  background-color: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 0.9em;
}

.v-expansion-panel-text {
  padding: 16px !important;
}

.v-simple-table td {
  padding: 8px 16px !important;
}
</style>
