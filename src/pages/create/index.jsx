import { Fragment, useEffect, useState } from 'react';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import tr from 'date-fns/locale/tr';
import { format, isSameDay, parse } from 'date-fns';
import { Listbox, Popover, Transition } from '@headlessui/react';
import {
  ChevronUpDownIcon,
  CheckIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
registerLocale('tr', tr);
import './css/style.css';

const appointments = [
  {
    id: 1,
    date: '13/10/2023',
    time: '08:00',
    name: 'Caner Ağkaya',
    barber: 'Arif Canbay',
    service: 'Saç Kesimi',
  },
  {
    id: 2,
    date: '13/10/2023',
    time: '08:45',
    name: 'Ömer Faruk Bulut',
    barber: 'Arif Canbay',
    service: 'Saç Kesimi',
  },
  {
    id: 3,
    date: '13/10/2023',
    time: '13:00',
    name: 'Kürşat Şahin',
    barber: 'Hasan Kaya',
    service: 'Saç & Sakal Kesimi',
  },
  {
    id: 4,
    date: '14/10/2023',
    time: '16:45',
    name: 'Erhan Çelik',
    barber: 'Hasan Kaya',
    service: 'Saç Boyama',
  },
  {
    id: 5,
    date: '14/10/2023',
    time: '17:30',
    name: 'Hacı Ak',
    barber: 'Hasan Kaya',
    service: 'Saç Kesimi',
  },
];

const workTimes = [
  { id: 1, time: '08:00' },
  { id: 2, time: '08:45' },
  { id: 3, time: '09:30' },
  { id: 4, time: '10:15' },
  { id: 5, time: '11:00' },
  { id: 6, time: '11:45' },
  { id: 7, time: '13:00' },
  { id: 8, time: '13:45' },
  { id: 9, time: '14:30' },
  { id: 10, time: '15:15' },
  { id: 11, time: '16:00' },
  { id: 12, time: '16:45' },
  { id: 13, time: '17:30' },
  { id: 14, time: '18:15' },
  { id: 15, time: '19:00' },
  { id: 16, time: '19:45' },
  { id: 17, time: '20:30' },
  { id: 18, time: '21:15' },
];

const services = [
  { id: 1, name: 'Saç Kesimi', price: 50 },
  { id: 2, name: 'Sakal Kesimi', price: 30 },
  { id: 3, name: 'Saç & Sakal Kesimi', price: 70 },
  { id: 4, name: 'Saç Boyama', price: 100 },
];

const barbers = [
  {
    id: 1,
    name: 'Arif Canbay',
    appointments: [
      {
        id: 1,
        date: '13/10/2023',
        time: '08:00',
        name: 'Caner Ağkaya',
        barber: 'Arif Canbay',
        service: 'Saç Kesimi',
      },
      {
        id: 2,
        date: '13/10/2023',
        time: '08:45',
        name: 'Ömer Faruk Bulut',
        barber: 'Arif Canbay',
        service: 'Saç Kesimi',
      },
    ],
  },
  {
    id: 2,
    name: 'Hasan Kaya',
    appointments: [
      {
        id: 3,
        date: '13/10/2023',
        time: '13:00',
        name: 'Kürşat Şahin',
        barber: 'Hasan Kaya',
        service: 'Saç & Sakal Kesimi',
      },
      {
        id: 4,
        date: '14/10/2023',
        time: '16:45',
        name: 'Erhan Çelik',
        barber: 'Hasan Kaya',
        service: 'Saç Boyama',
      },
      {
        id: 5,
        date: '14/10/2023',
        time: '17:30',
        name: 'Hacı Ak',
        barber: 'Hasan Kaya',
        service: 'Saç Kesimi',
      },
    ],
  },
];

const holiday = 0;

export default function Create() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const formattedSelectedDate = `${selectedDate.getDate()}/${
    selectedDate.getMonth() + 1
  }/${selectedDate.getFullYear()}`;

  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBarber, setSelectedBarber] = useState(null);

  // Tarihe göre randevuları filtreleme fonksiyonu
  const filteredAppointments = appointments.filter((appointment) => {
    // Randevu tarihini düzgün bir şekilde ayrıştırın
    const appointmentDate = parse(appointment.date, 'dd/MM/yyyy', new Date());

    // Seçilen tarihe eşit mi kontrol et
    return isSameDay(appointmentDate, selectedDate);
  });

  // Randevuları saatlerine göre sırala
  filteredAppointments.sort((a, b) => {
    const timeA = a.time;
    const timeB = b.time;

    // Saatleri karşılaştır
    if (timeA < timeB) {
      return -1;
    }
    if (timeA > timeB) {
      return 1;
    }
    return 0;
  });

  // Seçilen tarihteki randevuların saatlerini bul ve çıkar
  const unavailableTimes = filteredAppointments.map(
    (appointment) => appointment.time
  );

  // Tüm saatlerden seçilen tarihteki randevuların saatlerini çıkar
  const availableTimes = workTimes.filter(
    (workTime) => !unavailableTimes.includes(workTime.time)
  );

  // Seçilen berbere göre randevuları filtrele
  const filteredAppointmentsByBarber = barbers.filter(
    (barber) => barber.name === selectedBarber?.name
  )[0]?.appointments;

  // Seçilen berbere göre randevuları saatlerine göre sırala
  filteredAppointmentsByBarber?.sort((a, b) => {
    const timeA = a.time;
    const timeB = b.time;

    // Saatleri karşılaştır
    if (timeA < timeB) {
      return -1;
    }

    if (timeA > timeB) {
      return 1;
    }

    return 0;
  });

  // Seçilen berbere göre randevuların saatlerini bul ve çıkar
  const unavailableTimesByBarber = filteredAppointmentsByBarber?.map(
    (appointment) => appointment.time
  );

  // Tüm saatlerden seçilen berbere göre randevuların saatlerini çıkar
  const availableTimesByBarber = workTimes.filter(
    (workTime) => !unavailableTimesByBarber?.includes(workTime.time)
  );

  // Seçilen berbere göre randevuları tarihlerine göre sırala
  filteredAppointmentsByBarber?.sort((a, b) => {
    const dateA = a.date;
    const dateB = b.date;

    // Tarihleri karşılaştır
    if (dateA < dateB) {
      return -1;
    }

    if (dateA > dateB) {
      return 1;
    }

    return 0;
  });

  const handleSubmit = () => {
    const newAppointment = {
      id: Math.floor(Math.random() * 1000),
      date: formattedSelectedDate,
      time: selectedTime.time,
      name: 'Kemal Derviş',
      barber: selectedBarber.name,
      service: selectedService.name,
    };

    appointments.push(newAppointment);

    // İçeriği sıfırla
    setSelectedBarber(null);
    setSelectedTime(null);
    setSelectedService(null);
    setSelectedDate(new Date());

    toast.success('Randevu oluşturuldu.');
  };

  useEffect(() => {
    // Eğer selectedBarber null değilse (bir berber seçilmişse) ve
    // selectedTime null değilse (bir saat seçilmişse),
    // seçilen berberin çalıştığı saatler ile mevcut seçili saat
    // uyumsuzsa, seçili saati sıfırlar.
    if (selectedBarber && selectedTime) {
      const selectedTimeExists = availableTimesByBarber.some(
        (time) => time.time === selectedTime.time
      );
      if (!selectedTimeExists) {
        setSelectedTime(null);
      }
    }
  }, [selectedBarber, selectedTime, availableTimesByBarber]);

  return (
    <div className='flex'>
      <div className='flex-1'>
        <h1 className='text-2xl font-bold mb-5'>Randevu Oluştur</h1>

        <Popover>
          {({ open, close }) => (
            <>
              <Popover.Button className='border px-4 py-2 rounded-xl flex items-center'>
                <CalendarDaysIcon className='h-5 w-5 inline-block mr-2' />
                {format(selectedDate, 'dd-MM-yyyy')}
              </Popover.Button>
              <Transition
                as={Fragment}
                enter='transition ease-out duration-200'
                enterFrom='opacity-0 translate-y-1'
                enterTo='opacity-100 translate-y-0'
                leave='transition ease-in duration-150'
                leaveFrom='opacity-100 translate-y-0'
                leaveTo='opacity-0 translate-y-1'
              >
                <Popover.Panel className='absolute z-50 shadow rounded-xl overflow-auto p-2 pb-0 bg-white'>
                  <ReactDatePicker
                    selected={selectedDate}
                    onChange={(date) => {
                      setSelectedDate(date);
                      close();
                    }}
                    filterDate={(date) => date.getDay() !== holiday}
                    locale='tr'
                    dateFormat='dd/MM/yyyy'
                    minDate={new Date()}
                    showMonthDropdown
                    inline
                  />
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>

        <div className='flex items-center gap-2 z-10'>
          <div className='mt-5'>
            <Listbox value={selectedBarber} onChange={setSelectedBarber}>
              <div className='relative z-20'>
                <Listbox.Button className='relative cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm'>
                  <span className='block truncate'>
                    {selectedBarber ? selectedBarber.name : 'Berber Seçiniz'}
                  </span>
                  <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
                    <ChevronUpDownIcon
                      className='h-5 w-5 text-gray-400'
                      aria-hidden='true'
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave='transition ease-in duration-100'
                  leaveFrom='opacity-100'
                  leaveTo='opacity-0'
                >
                  <Listbox.Options className='absolute mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                    {barbers.map((barber) => (
                      <Listbox.Option key={barber.id} value={barber}>
                        {({ selected, active }) => (
                          <div
                            className={`
                        ${active ? 'text-white bg-blue-600' : 'text-black'}
                        cursor-default select-none relative py-2 pl-10 pr-4 group`}
                          >
                            {selected ? (
                              <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600 group-hover:text-white'>
                                <CheckIcon
                                  className='h-5 w-5'
                                  aria-hidden='true'
                                />
                              </span>
                            ) : null}
                            <span
                              className={`${
                                selected ? 'font-semibold' : 'font-normal'
                              } block truncate`}
                            >
                              {barber.name}
                            </span>
                          </div>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>

          <div className='mt-5'>
            <Listbox value={selectedTime} onChange={setSelectedTime}>
              <div className='relative z-10'>
                <Listbox.Button
                  aria-disabled={selectedBarber === null}
                  className={`${
                    selectedBarber === null
                      ? 'cursor-not-allowed opacity-50'
                      : 'cursor-default'
                  } relative rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm
                  
                  `}
                >
                  <span className='block truncate'>
                    {selectedTime ? selectedTime.time : 'Saat Seçiniz'}
                  </span>
                  <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
                    <ChevronUpDownIcon
                      className='h-5 w-5 text-gray-400'
                      aria-hidden='true'
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave='transition ease-in duration-100'
                  leaveFrom='opacity-100'
                  leaveTo='opacity-0'
                >
                  <Listbox.Options className='absolute mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                    {availableTimesByBarber.map((time) => (
                      <Listbox.Option key={time.id} value={time}>
                        {({ selected, active }) => (
                          <div
                            className={`${
                              unavailableTimesByBarber.includes(time.time)
                                ? 'pointer-events-none text-gray-400 cursor-not-allowed'
                                : active
                                ? 'text-white bg-blue-600'
                                : 'text-gray-900'
                            } cursor-default select-none relative py-2 pl-10 pr-4 group`}
                          >
                            {selected ? (
                              <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600 group-hover:text-white'>
                                <CheckIcon
                                  className='h-5 w-5'
                                  aria-hidden='true'
                                />
                              </span>
                            ) : null}
                            <span
                              className={`${
                                selected ? 'font-semibold' : 'font-normal'
                              } block truncate`}
                            >
                              {time.time}
                            </span>
                          </div>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>

          <div className='mt-5'>
            <Listbox value={selectedService} onChange={setSelectedService}>
              <div className='relative'>
                <Listbox.Button
                  aria-disabled={selectedTime === null}
                  className={`${
                    selectedTime === null
                      ? 'cursor-not-allowed opacity-50'
                      : 'cursor-default'
                  } relative rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm}`}
                >
                  <span className='block truncate'>
                    {selectedService ? selectedService.name : 'Hizmet Seçiniz'}
                  </span>
                  <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
                    <ChevronUpDownIcon
                      className='h-5 w-5 text-gray-400'
                      aria-hidden='true'
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave='transition ease-in duration-100'
                  leaveFrom='opacity-100'
                  leaveTo='opacity-0'
                >
                  <Listbox.Options className='absolute mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                    {services.map((service) => (
                      <Listbox.Option key={service.id} value={service}>
                        {({ selected, active }) => (
                          <div
                            className={`
                        ${active ? 'text-white bg-blue-600' : 'text-black'}
                        cursor-default select-none relative py-2 pl-10 pr-4 group`}
                          >
                            {selected ? (
                              <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600 group-hover:text-white'>
                                <CheckIcon
                                  className='h-5 w-5'
                                  aria-hidden='true'
                                />
                              </span>
                            ) : null}
                            <span
                              className={`${
                                selected ? 'font-semibold' : 'font-normal'
                              } block truncate`}
                            >
                              {service.name}
                            </span>
                          </div>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
        </div>

        {selectedBarber && selectedTime && selectedService && (
          <div className='mt-5'>
            <h2>Ödenecek Tutar: {selectedService.price} TL</h2>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={
            selectedBarber === null ||
            selectedTime === null ||
            selectedService === null
          }
          className={`${
            selectedBarber === null ||
            selectedTime === null ||
            selectedService === null
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'cursor-pointer'
          }
          mt-5 bg-blue-500 text-white px-4 py-2 rounded-xl`}
        >
          Randevu Oluştur
        </button>
      </div>

      <div className='flex-1'>
        <div>
          <h2 className='mb-4'>Seçilen Tarihteki Randevular:</h2>
          <ul className='space-y-2'>
            {filteredAppointments.map((appointment, i) => (
              <li
                key={appointment.id}
                className='px-4 py-3 border  rounded-xl text-sm'
              >
                <span>{i + 1} - </span>
                {appointment.date} - {appointment.time} - {appointment.name} -{' '}
                {appointment.barber} - {appointment.service}
              </li>
            ))}
          </ul>
        </div>
        <hr className='my-10' />
        <div>
          <h2 className='mb-4'>Tüm Randevular:</h2>
          <ul className='space-y-2'>
            {appointments.map((appointment, i) => (
              <li
                key={appointment.id}
                className='px-4 py-3 border  rounded-xl text-sm'
              >
                <span>{i + 1} - </span>
                {appointment.date} - {appointment.time} - {appointment.name} -{' '}
                {appointment.barber} - {appointment.service}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
