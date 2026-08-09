package com.KeyStone.DeliveryService.config;

import com.KeyStone.DeliveryService.domain.*;
import com.KeyStone.DeliveryService.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final SiteRepository siteRepository;
    private final PartRepository partRepository;
    private final WorkOrderRepository workOrderRepository;
    private final WorkOrderStatusHistoryRepository workOrderStatusHistoryRepository;
    private final PartUsageRepository partUsageRepository;
    private final TimeLogRepository timeLogRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            log.info("Populating initial seed data into Neon PostgreSQL database...");

            String defaultPasswordHash = passwordEncoder.encode("password123");

            User admin = userRepository.save(User.builder()
                    .email("admin@meridian.com")
                    .passwordHash(defaultPasswordHash)
                    .fullName("Marcus Vance (Manager)")
                    .role(Role.ADMIN)
                    .phone("+1-555-0101")
                    .active(true)
                    .build());

            User dispatcher = userRepository.save(User.builder()
                    .email("dispatcher@meridian.com")
                    .passwordHash(defaultPasswordHash)
                    .fullName("Diana Ross (Dispatcher)")
                    .role(Role.DISPATCHER)
                    .phone("+1-555-0102")
                    .active(true)
                    .build());

            User techJohn = userRepository.save(User.builder()
                    .email("tech.john@meridian.com")
                    .passwordHash(defaultPasswordHash)
                    .fullName("John Doe (Lead Technician)")
                    .role(Role.TECHNICIAN)
                    .phone("+1-555-0103")
                    .active(true)
                    .build());

            User techSarah = userRepository.save(User.builder()
                    .email("tech.sarah@meridian.com")
                    .passwordHash(defaultPasswordHash)
                    .fullName("Sarah Connor (Senior HVAC Tech)")
                    .role(Role.TECHNICIAN)
                    .phone("+1-555-0104")
                    .active(true)
                    .build());

            User customerUser = userRepository.save(User.builder()
                    .email("customer.acme@meridian.com")
                    .passwordHash(defaultPasswordHash)
                    .fullName("Alice Smith (Acme Facilities)")
                    .role(Role.CUSTOMER)
                    .phone("+1-555-0105")
                    .active(true)
                    .build());

            // Customers
            Customer custAcme = customerRepository.save(Customer.builder()
                    .name("Acme Corporation")
                    .code("CUST-ACME")
                    .contactEmail("customer.acme@meridian.com")
                    .contactPhone("+1-555-1000")
                    .address("100 Industrial Parkway, Building A")
                    .active(true)
                    .build());

            Customer custApex = customerRepository.save(Customer.builder()
                    .name("Apex Commercial Real Estate")
                    .code("CUST-APEX")
                    .contactEmail("facilities@apexre.com")
                    .contactPhone("+1-555-2000")
                    .address("500 Skyline Boulevard, Suite 1200")
                    .active(true)
                    .build());

            Customer custNexus = customerRepository.save(Customer.builder()
                    .name("Nexus Retail Group")
                    .code("CUST-NEXUS")
                    .contactEmail("ops@nexusretail.com")
                    .contactPhone("+1-555-3000")
                    .address("750 Galleria Way")
                    .active(true)
                    .build());

            // Sites
            Site siteAcmeHq = siteRepository.save(Site.builder()
                    .name("Acme HQ Building A")
                    .address("100 Industrial Parkway, Tower A")
                    .customer(custAcme)
                    .contactPerson("Alice Smith")
                    .active(true)
                    .build());

            Site siteAcmeLab = siteRepository.save(Site.builder()
                    .name("Acme R&D Lab Facility")
                    .address("102 Industrial Parkway, Building B")
                    .customer(custAcme)
                    .contactPerson("Robert Johnson")
                    .active(true)
                    .build());

            Site siteApexPlaza = siteRepository.save(Site.builder()
                    .name("Apex Financial Plaza")
                    .address("500 Skyline Blvd, Main Tower")
                    .customer(custApex)
                    .contactPerson("David Miller")
                    .active(true)
                    .build());

            Site siteNexusMall = siteRepository.save(Site.builder()
                    .name("Metro Galleria Mall - South")
                    .address("750 Galleria Way, South Wing")
                    .customer(custNexus)
                    .contactPerson("Karen White")
                    .active(true)
                    .build());

            // Parts
            Part partFilter = partRepository.save(Part.builder()
                    .name("HVAC Air Filter 20x25x4")
                    .sku("PRT-FLT-2025")
                    .unitCost(new BigDecimal("24.50"))
                    .stockQty(45)
                    .minStockLevel(10)
                    .build());

            Part partPipe = partRepository.save(Part.builder()
                    .name("Commercial Copper Pipe 3/4\" (10ft)")
                    .sku("PRT-COP-0075")
                    .unitCost(new BigDecimal("38.00"))
                    .stockQty(20)
                    .minStockLevel(5)
                    .build());

            Part partBreaker = partRepository.save(Part.builder()
                    .name("Industrial Circuit Breaker 20A")
                    .sku("PRT-BRK-0020")
                    .unitCost(new BigDecimal("85.00"))
                    .stockQty(15)
                    .minStockLevel(4)
                    .build());

            Part partTank = partRepository.save(Part.builder()
                    .name("Refrigerant R410A Tank (25lb)")
                    .sku("PRT-REF-410A")
                    .unitCost(new BigDecimal("195.00"))
                    .stockQty(8)
                    .minStockLevel(2)
                    .build());

            Part partThermostat = partRepository.save(Part.builder()
                    .name("Smart Commercial Thermostat Pro")
                    .sku("PRT-TST-PRO")
                    .unitCost(new BigDecimal("150.00"))
                    .stockQty(12)
                    .minStockLevel(3)
                    .build());

            log.info("Neon PostgreSQL database user & asset seed initialization complete!");
        }

        if (workOrderRepository.count() == 0) {
            log.info("Seeding Work Orders into Neon PostgreSQL database...");

            User admin = userRepository.findByEmail("admin@meridian.com").orElse(null);
            User dispatcher = userRepository.findByEmail("dispatcher@meridian.com").orElse(null);
            User techJohn = userRepository.findByEmail("tech.john@meridian.com").orElse(null);
            User techSarah = userRepository.findByEmail("tech.sarah@meridian.com").orElse(null);

            Customer custAcme = customerRepository.findByCode("CUST-ACME").orElse(null);
            Customer custApex = customerRepository.findByCode("CUST-APEX").orElse(null);
            Customer custNexus = customerRepository.findByCode("CUST-NEXUS").orElse(null);

            Site siteAcmeHq = siteRepository.findAll().stream().filter(s -> s.getName().contains("HQ")).findFirst().orElse(null);
            Site siteAcmeLab = siteRepository.findAll().stream().filter(s -> s.getName().contains("Lab")).findFirst().orElse(null);
            Site siteApexPlaza = siteRepository.findAll().stream().filter(s -> s.getName().contains("Apex")).findFirst().orElse(null);
            Site siteNexusMall = siteRepository.findAll().stream().filter(s -> s.getName().contains("Mall")).findFirst().orElse(null);

            Part partFilter = partRepository.findBySku("PRT-FLT-2025").orElse(null);
            Part partPipe = partRepository.findBySku("PRT-COP-0075").orElse(null);
            Part partBreaker = partRepository.findBySku("PRT-BRK-0020").orElse(null);
            Part partTank = partRepository.findBySku("PRT-REF-410A").orElse(null);
            Part partThermostat = partRepository.findBySku("PRT-TST-PRO").orElse(null);

            if (custAcme != null && siteAcmeHq != null) {
                // Seed Work Orders
                WorkOrder wo1001 = workOrderRepository.save(WorkOrder.builder()
                        .code("WO-1001")
                        .title("HVAC Cooling Malfunction - 4th Floor Office")
                        .description("Air conditioning unit making loud rattling noise and blowing warm air. High priority due to server room proximity.")
                        .priority(Priority.HIGH)
                        .status(WorkOrderStatus.IN_PROGRESS)
                        .customer(custAcme)
                        .site(siteAcmeHq)
                        .assignedTo(techJohn)
                        .createdBy(dispatcher)
                        .slaDueAt(LocalDateTime.now().plusHours(20))
                        .totalPartsCost(new BigDecimal("219.50"))
                        .totalLabourMinutes(120)
                        .build());

                WorkOrder wo1002 = workOrderRepository.save(WorkOrder.builder()
                        .code("WO-1002")
                        .title("Main Electrical Panel Tripped - South Wing")
                        .description("Breaker tripped twice during morning power surge. Needs immediate load inspection.")
                        .priority(Priority.URGENT)
                        .status(WorkOrderStatus.ASSIGNED)
                        .customer(custNexus != null ? custNexus : custAcme)
                        .site(siteNexusMall != null ? siteNexusMall : siteAcmeHq)
                        .assignedTo(techSarah)
                        .createdBy(dispatcher)
                        .slaDueAt(LocalDateTime.now().plusHours(2))
                        .totalPartsCost(BigDecimal.ZERO)
                        .totalLabourMinutes(0)
                        .build());

                WorkOrder wo1003 = workOrderRepository.save(WorkOrder.builder()
                        .code("WO-1003")
                        .title("Routine Quarterly Filter Replacement")
                        .description("Scheduled maintenance to replace all HVAC primary and secondary filters in Building B.")
                        .priority(Priority.LOW)
                        .status(WorkOrderStatus.NEW)
                        .customer(custAcme)
                        .site(siteAcmeLab != null ? siteAcmeLab : siteAcmeHq)
                        .assignedTo(null)
                        .createdBy(admin)
                        .slaDueAt(LocalDateTime.now().plusHours(48))
                        .totalPartsCost(BigDecimal.ZERO)
                        .totalLabourMinutes(0)
                        .build());

                WorkOrder wo1004 = workOrderRepository.save(WorkOrder.builder()
                        .code("WO-1004")
                        .title("Water Pipe Leak under Restroom Sink")
                        .description("Minor water seepage detected near main supply valve on 2nd floor.")
                        .priority(Priority.MEDIUM)
                        .status(WorkOrderStatus.ON_HOLD)
                        .customer(custApex != null ? custApex : custAcme)
                        .site(siteApexPlaza != null ? siteApexPlaza : siteAcmeHq)
                        .assignedTo(techJohn)
                        .createdBy(dispatcher)
                        .slaDueAt(LocalDateTime.now().minusHours(2))
                        .totalPartsCost(new BigDecimal("38.00"))
                        .totalLabourMinutes(45)
                        .build());

                WorkOrder wo1005 = workOrderRepository.save(WorkOrder.builder()
                        .code("WO-1005")
                        .title("Thermostat Calibration and Firmware Update")
                        .description("Adjust setpoints and calibrate temperature sensors in executive suite.")
                        .priority(Priority.MEDIUM)
                        .status(WorkOrderStatus.COMPLETED)
                        .customer(custAcme)
                        .site(siteAcmeHq)
                        .assignedTo(techSarah)
                        .createdBy(dispatcher)
                        .slaDueAt(LocalDateTime.now().minusHours(12))
                        .totalPartsCost(new BigDecimal("150.00"))
                        .totalLabourMinutes(60)
                        .build());

                // Status History
                workOrderStatusHistoryRepository.save(WorkOrderStatusHistory.builder()
                        .workOrder(wo1001)
                        .fromStatus(WorkOrderStatus.NEW)
                        .toStatus(WorkOrderStatus.ASSIGNED)
                        .changedBy(dispatcher)
                        .note("Assigned to Lead Technician John Doe")
                        .build());

                workOrderStatusHistoryRepository.save(WorkOrderStatusHistory.builder()
                        .workOrder(wo1001)
                        .fromStatus(WorkOrderStatus.ASSIGNED)
                        .toStatus(WorkOrderStatus.IN_PROGRESS)
                        .changedBy(techJohn)
                        .note("Arrived on site. Commenced HVAC inspection.")
                        .build());

                // Part Usages
                if (partFilter != null) {
                    partUsageRepository.save(PartUsage.builder()
                            .workOrder(wo1001)
                            .part(partFilter)
                            .qtyUsed(1)
                            .unitCostAtTime(new BigDecimal("24.50"))
                            .lineTotal(new BigDecimal("24.50"))
                            .build());
                }

                if (partTank != null) {
                    partUsageRepository.save(PartUsage.builder()
                            .workOrder(wo1001)
                            .part(partTank)
                            .qtyUsed(1)
                            .unitCostAtTime(new BigDecimal("195.00"))
                            .lineTotal(new BigDecimal("195.00"))
                            .build());
                }

                if (partPipe != null) {
                    partUsageRepository.save(PartUsage.builder()
                            .workOrder(wo1004)
                            .part(partPipe)
                            .qtyUsed(1)
                            .unitCostAtTime(new BigDecimal("38.00"))
                            .lineTotal(new BigDecimal("38.00"))
                            .build());
                }

                if (partThermostat != null) {
                    partUsageRepository.save(PartUsage.builder()
                            .workOrder(wo1005)
                            .part(partThermostat)
                            .qtyUsed(1)
                            .unitCostAtTime(new BigDecimal("150.00"))
                            .lineTotal(new BigDecimal("150.00"))
                            .build());
                }

                // Time Logs
                if (techJohn != null) {
                    timeLogRepository.save(TimeLog.builder()
                            .workOrder(wo1001)
                            .technician(techJohn)
                            .minutes(60)
                            .note("Initial diagnostic and pressure check")
                            .build());

                    timeLogRepository.save(TimeLog.builder()
                            .workOrder(wo1001)
                            .technician(techJohn)
                            .minutes(60)
                            .note("Replaced R410A refrigerant and air filter")
                            .build());

                    timeLogRepository.save(TimeLog.builder()
                            .workOrder(wo1004)
                            .technician(techJohn)
                            .minutes(45)
                            .note("Sealed leak temporarily and placed hold order")
                            .build());
                }

                if (techSarah != null) {
                    timeLogRepository.save(TimeLog.builder()
                            .workOrder(wo1005)
                            .technician(techSarah)
                            .minutes(60)
                            .note("Installed Smart Thermostat Pro and updated firmware")
                            .build());
                }
            }

            log.info("Neon PostgreSQL database seed initialization complete with Work Orders!");
        }
    }
}
