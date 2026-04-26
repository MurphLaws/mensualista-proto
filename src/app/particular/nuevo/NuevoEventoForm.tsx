"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { api } from "@/lib/api";

const COVERS = ["/covers/picnic.svg", "/covers/charla.svg", "/covers/funcional.svg"];

export function NuevoEventoForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startsAt, setStartsAt] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    d.setHours(18, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [capacity, setCapacity] = useState(15);
  const [coverUrl, setCoverUrl] = useState(COVERS[0]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api("/api/listings", {
        method: "POST",
        body: JSON.stringify({
          type: "EVENTO",
          title,
          description,
          location,
          startsAt: new Date(startsAt).toISOString(),
          capacity,
          priceCents: 0,
          coverUrl,
        }),
      });
      router.push("/particular");
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="card space-y-5 p-6">
      <div data-tour="particular-new.title">
        <Label htmlFor="title">Titulo del evento</Label>
        <Input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="p. ej. Picnic literario en el parque" />
      </div>

      <div>
        <Label htmlFor="desc">Descripcion</Label>
        <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="De que se trata, que llevar, hora de inicio." />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="loc">Ubicacion</Label>
          <Input id="loc" required value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Parque Centenario" />
        </div>
        <div>
          <Label htmlFor="when">Fecha y hora</Label>
          <Input id="when" type="datetime-local" required value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div data-tour="particular-new.capacity">
          <Label htmlFor="cap">Cupo</Label>
          <Input id="cap" type="number" min={1} required value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} />
        </div>
        <div>
          <Label>Imagen de portada</Label>
          <Select value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)}>
            {COVERS.map((c) => (
              <option key={c} value={c}>
                {c.replace("/covers/", "").replace(".svg", "")}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center justify-end gap-2 border-t border-ink-100 pt-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Publicando..." : "Publicar"}
        </Button>
      </div>
    </form>
  );
}
