export {
    installLicense,
    type InstallLicenseOptions,
} from "./src/install_license.ts";

export {
    LicenseRegistry,
    SUPPORTED_LICENSE_KEYS,
} from "./src/LicenseRegistry.ts"

// --- CLI entrypoint ---
if (import.meta.main) {
    const { installLicense }  = await import("./src/install_license.ts");
    await installLicense()
}