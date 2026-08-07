package com.KeyStone.DeliveryService.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Forwards all non-API, non-resource GET requests to index.html
 * so that React Router can handle client-side navigation (SPA fallback).
 */
@Controller
public class SpaController {

    /**
     * Any path that doesn't start with /api, /swagger-ui, /api-docs,
     * or map to a static file is forwarded to the React SPA entry point.
     */
    @RequestMapping(value = {
            "/login",
            "/dashboard",
            "/work-orders",
            "/work-orders/**",
            "/customers",
            "/customers/**",
            "/sites",
            "/sites/**",
            "/parts",
            "/parts/**",
            "/users",
            "/users/**",
            "/reports",
            "/profile",
            "/settings"
    })
    public String forwardToSpa() {
        return "forward:/index.html";
    }
}
