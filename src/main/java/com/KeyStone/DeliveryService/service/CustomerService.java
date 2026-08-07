package com.KeyStone.DeliveryService.service;

import com.KeyStone.DeliveryService.domain.Customer;
import com.KeyStone.DeliveryService.domain.Site;
import com.KeyStone.DeliveryService.dto.*;
import com.KeyStone.DeliveryService.repository.CustomerRepository;
import com.KeyStone.DeliveryService.repository.SiteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final SiteRepository siteRepository;

    public CustomerService(CustomerRepository customerRepository, SiteRepository siteRepository) {
        this.customerRepository = customerRepository;
        this.siteRepository = siteRepository;
    }

    @Transactional
    public CustomerResponse createCustomer(CreateCustomerRequest request) {
        if (customerRepository.existsByCode(request.getCode())) {
            throw new IllegalArgumentException("Customer code already exists: " + request.getCode());
        }
        Customer customer = Customer.builder()
                .name(request.getName())
                .code(request.getCode())
                .contactEmail(request.getContactEmail())
                .contactPhone(request.getContactPhone())
                .address(request.getAddress())
                .active(true)
                .build();
        return mapToResponse(customerRepository.save(customer));
    }

    @Transactional(readOnly = true)
    public List<CustomerResponse> getAllCustomers() {
        return customerRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CustomerResponse getCustomerById(Long id) {
        return mapToResponse(customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found: " + id)));
    }

    @Transactional
    public SiteResponse createSite(CreateSiteRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found: " + request.getCustomerId()));
        Site site = Site.builder()
                .name(request.getName())
                .address(request.getAddress())
                .customer(customer)
                .contactPerson(request.getContactPerson())
                .active(true)
                .build();
        return mapSiteToResponse(siteRepository.save(site));
    }

    @Transactional(readOnly = true)
    public List<SiteResponse> getAllSites() {
        return siteRepository.findAll().stream().map(this::mapSiteToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SiteResponse> getSitesByCustomer(Long customerId) {
        return siteRepository.findByCustomerId(customerId).stream()
                .map(this::mapSiteToResponse).collect(Collectors.toList());
    }

    private CustomerResponse mapToResponse(Customer c) {
        return CustomerResponse.builder()
                .id(c.getId())
                .name(c.getName())
                .code(c.getCode())
                .contactEmail(c.getContactEmail())
                .contactPhone(c.getContactPhone())
                .address(c.getAddress())
                .active(c.isActive())
                .createdAt(c.getCreatedAt())
                .build();
    }

    private SiteResponse mapSiteToResponse(Site s) {
        return SiteResponse.builder()
                .id(s.getId())
                .name(s.getName())
                .address(s.getAddress())
                .customerId(s.getCustomer() != null ? s.getCustomer().getId() : null)
                .customerName(s.getCustomer() != null ? s.getCustomer().getName() : null)
                .contactPerson(s.getContactPerson())
                .active(s.isActive())
                .createdAt(s.getCreatedAt())
                .build();
    }
}
